import React, { useState, useEffect } from "react";
import { Reserva } from "../types/Reserva";
import { Inquilino } from "../types/Inquilino";
import { TipoReserva } from "../types/TipoReserva";
import { EstadoReserva } from "../types/EstadoReserva";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";
import { createInquilino, updateInquilino } from "../api/inquilinos";
import { getTiposReserva } from "../api/tiposReserva";
import { getEstadosReserva } from "../api/estadosReserva";
import { useReservas } from "../context/ReservasContext";
import DetalleReservaRow, { DetalleReservaRowData, calcularNoches } from "./DetalleReservaRow";

export interface PrefillDetalle {
  complejoId: number;
  unidad: UnidadAlojamiento;
  fechaDesde: string;
  fechaHasta: string;
}

interface ReservaFormProps {
  initialData?: Reserva;
  prefillDetalle?: PrefillDetalle;
  onSubmit: (reserva: Reserva) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  inquilino?: string;
  tipoReserva?: string;
  estadoReserva?: string;
  detalle?: string;
}

interface InquilinoFormData {
  inquilinoId?: number;
  nombre: string;
  telefono: string;
  apellido: string;
  direccion: string;
  descripcion: string;
}

const TIPO_RESERVA_DEFAULT = "directa";
const ESTADO_RESERVA_DEFAULT = "confirmado";
const ESTADO_QUE_OCUPA = "confirmado";

const emptyInquilinoData = (): InquilinoFormData => ({
  nombre: "",
  telefono: "",
  apellido: "",
  direccion: "",
  descripcion: ""
});

const inquilinoDataFrom = (inquilino?: Inquilino): InquilinoFormData => {
  if (!inquilino) return emptyInquilinoData();
  return {
    inquilinoId: inquilino.inquilinoId,
    nombre: inquilino.nombre ?? "",
    telefono: inquilino.telefono ?? "",
    apellido: inquilino.apellido ?? "",
    direccion: inquilino.direccion ?? "",
    descripcion: inquilino.descripcion ?? ""
  };
};

let rowIdCounter = 0;
const nextRowId = (): string => `row-${rowIdCounter++}`;

const toDateInput = (fecha?: string): string => (fecha ? fecha.slice(0, 10) : "");

const emptyDetalleRow = (): DetalleReservaRowData => ({
  rowId: nextRowId(),
  complejoId: "",
  unidadAlojamiento: null,
  precioACobrar: 0,
  cantidadPersonas: 1,
  fechaDesde: "",
  fechaHasta: ""
});

const rowsFromReserva = (reserva?: Reserva, prefillDetalle?: PrefillDetalle): DetalleReservaRowData[] => {
  if (reserva) {
    if (reserva.detalleReserva.length === 0) return [emptyDetalleRow()];
    return reserva.detalleReserva.map(d => ({
      rowId: nextRowId(),
      detalleReservaId: d.detalleReservaId,
      complejoId: d.unidadAlojamiento?.complejoId ?? "",
      unidadAlojamiento: d.unidadAlojamiento,
      precioACobrar: d.precioACobrar,
      cantidadPersonas: d.cantidadPersonas,
      fechaDesde: toDateInput(d.fechaDesde),
      fechaHasta: toDateInput(d.fechaHasta)
    }));
  }

  if (prefillDetalle) {
    const noches = calcularNoches(prefillDetalle.fechaDesde, prefillDetalle.fechaHasta) || 1;
    return [{
      rowId: nextRowId(),
      complejoId: prefillDetalle.complejoId,
      unidadAlojamiento: prefillDetalle.unidad,
      precioACobrar: prefillDetalle.unidad.precio * noches,
      cantidadPersonas: 1,
      fechaDesde: prefillDetalle.fechaDesde,
      fechaHasta: prefillDetalle.fechaHasta
    }];
  }

  return [emptyDetalleRow()];
};

const seSuperponen = (aDesde: string, aHasta: string, bDesde: string, bHasta: string): boolean =>
  aDesde < bHasta && bDesde < aHasta;

const formatMoneda = (valor: number): string =>
  (valor || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const ReservaForm: React.FC<ReservaFormProps> = ({ initialData, prefillDetalle, onSubmit, onCancel, isLoading }) => {
  const { reservas } = useReservas();
  const [tiposReserva, setTiposReserva] = useState<TipoReserva[]>([]);
  const [estadosReserva, setEstadosReserva] = useState<EstadoReserva[]>([]);
  const [loadingListas, setLoadingListas] = useState(true);

  const [inquilinoData, setInquilinoData] = useState<InquilinoFormData>(() => inquilinoDataFrom(initialData?.inquilino));
  const [mostrarMasDatosInquilino, setMostrarMasDatosInquilino] = useState(false);
  const [savingInquilino, setSavingInquilino] = useState(false);

  const [tipoReservaId, setTipoReservaId] = useState<number | "">(initialData?.tipoReserva?.tipoReservaId ?? "");
  const [estadoReservaId, setEstadoReservaId] = useState<number | "">(initialData?.estadoReserva?.estadoReservaId ?? "");
  const [seña, setSeña] = useState<number>(initialData?.seña ?? 0);
  const [totalPagado, setTotalPagado] = useState<number>(initialData?.TotalPagado ?? 0);
  const [descripcion, setDescripcion] = useState<string>(initialData?.descripcion ?? "");
  const [detalles, setDetalles] = useState<DetalleReservaRowData[]>(() => rowsFromReserva(initialData, prefillDetalle));
  const [errors, setErrors] = useState<FormErrors>({});
  const [rowConflicts, setRowConflicts] = useState<Record<string, string>>({});

  const totalAPagar = detalles.reduce((sum, d) => sum + (Number(d.precioACobrar) || 0), 0);
  const debe = totalAPagar - totalPagado;

  useEffect(() => {
    Promise.all([getTiposReserva(), getEstadosReserva()])
      .then(([tipos, estados]) => {
        setTiposReserva(tipos);
        setEstadosReserva(estados);
        if (!initialData) {
          const directa = tipos.find(t => t.nombre?.trim().toLowerCase() === TIPO_RESERVA_DEFAULT);
          if (directa) setTipoReservaId(directa.tipoReservaId ?? "");

          const confirmado = estados.find(e => e.nombre?.trim().toLowerCase() === ESTADO_RESERVA_DEFAULT);
          if (confirmado) setEstadoReservaId(confirmado.estadoReservaId ?? "");
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingListas(false));
  }, []);

  useEffect(() => {
    setInquilinoData(inquilinoDataFrom(initialData?.inquilino));
    setTipoReservaId(initialData?.tipoReserva?.tipoReservaId ?? "");
    setEstadoReservaId(initialData?.estadoReserva?.estadoReservaId ?? "");
    setSeña(initialData?.seña ?? 0);
    setTotalPagado(initialData?.TotalPagado ?? 0);
    setDescripcion(initialData?.descripcion ?? "");
    setDetalles(rowsFromReserva(initialData, prefillDetalle));
    setMostrarMasDatosInquilino(false);
    setRowConflicts({});
  }, [initialData]);

  const handleDetalleChange = (rowId: string, data: DetalleReservaRowData) => {
    setDetalles(prev => prev.map(d => (d.rowId === rowId ? data : d)));
  };

  const handleAddDetalle = () => {
    setDetalles(prev => [...prev, emptyDetalleRow()]);
  };

  const handleRemoveDetalle = (rowId: string) => {
    setDetalles(prev => prev.filter(d => d.rowId !== rowId));
  };

  const handleSeñaChange = (value: number) => {
    const diff = value - seña;
    setSeña(value);
    setTotalPagado(prev => Math.max(0, prev + diff));
  };

  const buscarConflicto = (row: DetalleReservaRowData): string | null => {
    if (!row.unidadAlojamiento || !row.fechaDesde || !row.fechaHasta) return null;
    const unidadId = row.unidadAlojamiento.unidadAlojamientoId;

    for (const otraFila of detalles) {
      if (otraFila.rowId === row.rowId) continue;
      if (otraFila.unidadAlojamiento?.unidadAlojamientoId !== unidadId) continue;
      if (!otraFila.fechaDesde || !otraFila.fechaHasta) continue;
      if (seSuperponen(row.fechaDesde, row.fechaHasta, otraFila.fechaDesde, otraFila.fechaHasta)) {
        return "Se superpone con otra unidad de esta misma reserva";
      }
    }

    for (const reserva of reservas) {
      if (initialData?.reservaId && reserva.reservaId === initialData.reservaId) continue;
      if (reserva.estadoReserva?.nombre?.trim().toLowerCase() !== ESTADO_QUE_OCUPA) continue;

      for (const d of reserva.detalleReserva || []) {
        if (d.unidadAlojamiento?.unidadAlojamientoId !== unidadId) continue;
        const dDesde = d.fechaDesde?.slice(0, 10);
        const dHasta = d.fechaHasta?.slice(0, 10);
        if (dDesde && dHasta && seSuperponen(row.fechaDesde, row.fechaHasta, dDesde, dHasta)) {
          return `Ya está reservada del ${dDesde} al ${dHasta} (reserva confirmada)`;
        }
      }
    }

    return null;
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!inquilinoData.nombre.trim()) newErrors.inquilino = "El nombre del inquilino es requerido";
    else if (!inquilinoData.telefono.trim()) newErrors.inquilino = "El teléfono del inquilino es requerido";

    if (!tipoReservaId) newErrors.tipoReserva = "Debe seleccionar un tipo de reserva";
    if (!estadoReservaId) newErrors.estadoReserva = "Debe seleccionar un estado";

    const detalleValido = detalles.length > 0 && detalles.every(
      d => d.unidadAlojamiento && d.fechaDesde && d.fechaHasta && d.cantidadPersonas > 0
    );
    if (!detalleValido) {
      newErrors.detalle = "Complete complejo, unidad y fechas de cada unidad reservada";
    }

    const nuevosConflictos: Record<string, string> = {};
    if (detalleValido) {
      for (const row of detalles) {
        const conflicto = buscarConflicto(row);
        if (conflicto) nuevosConflictos[row.rowId] = conflicto;
      }
      if (Object.keys(nuevosConflictos).length > 0) {
        newErrors.detalle = "Hay unidades con fechas que se superponen con otra reserva";
      }
    }
    setRowConflicts(nuevosConflictos);

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    let inquilino: Inquilino;
    const payload: Inquilino = {
      inquilinoId: inquilinoData.inquilinoId,
      nombre: inquilinoData.nombre.trim(),
      telefono: inquilinoData.telefono.trim(),
      apellido: inquilinoData.apellido.trim(),
      direccion: inquilinoData.direccion.trim(),
      descripcion: inquilinoData.descripcion.trim()
    };

    try {
      setSavingInquilino(true);
      inquilino = inquilinoData.inquilinoId
        ? await updateInquilino(payload)
        : await createInquilino(payload);
    } catch (err) {
      console.error(err);
      setErrors(prev => ({ ...prev, inquilino: "Error al guardar el inquilino" }));
      return;
    } finally {
      setSavingInquilino(false);
    }

    const tipoReserva = tiposReserva.find(t => t.tipoReservaId === tipoReservaId)!;
    const estadoReserva = estadosReserva.find(e => e.estadoReservaId === estadoReservaId)!;

    const reserva: Reserva = {
      reservaId: initialData?.reservaId,
      inquilino,
      tipoReserva,
      estadoReserva,
      seña,
      TotalAPagar: totalAPagar,
      TotalPagado: totalPagado,
      descripcion: descripcion.trim(),
      detalleReserva: detalles.map(d => ({
        detalleReservaId: d.detalleReservaId,
        reservaId: initialData?.reservaId,
        unidadAlojamiento: d.unidadAlojamiento!,
        precioACobrar: d.precioACobrar,
        cantidadPersonas: d.cantidadPersonas,
        fechaDesde: d.fechaDesde,
        fechaHasta: d.fechaHasta
      }))
    };

    await onSubmit(reserva);
  };

  if (loadingListas) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Inquilino *
        </label>
        <div className="space-y-2 border border-gray-200 rounded-md p-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="text"
              value={inquilinoData.nombre}
              onChange={e => setInquilinoData(prev => ({ ...prev, nombre: e.target.value }))}
              placeholder="Nombre *"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.inquilino ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
            <input
              type="text"
              value={inquilinoData.telefono}
              onChange={e => setInquilinoData(prev => ({ ...prev, telefono: e.target.value }))}
              placeholder="Teléfono *"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.inquilino ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
              }`}
            />
          </div>
          {errors.inquilino && <p className="text-sm text-red-600">{errors.inquilino}</p>}

          <button
            type="button"
            onClick={() => setMostrarMasDatosInquilino(v => !v)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {mostrarMasDatosInquilino ? "Ocultar datos adicionales" : "+ Agregar más datos (opcional)"}
          </button>

          {mostrarMasDatosInquilino && (
            <div className="grid grid-cols-1 gap-2">
              <input
                type="text"
                value={inquilinoData.apellido}
                onChange={e => setInquilinoData(prev => ({ ...prev, apellido: e.target.value }))}
                placeholder="Apellido"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                value={inquilinoData.direccion}
                onChange={e => setInquilinoData(prev => ({ ...prev, direccion: e.target.value }))}
                placeholder="Dirección"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea
                value={inquilinoData.descripcion}
                onChange={e => setInquilinoData(prev => ({ ...prev, descripcion: e.target.value }))}
                placeholder="Descripción"
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          )}

          <p className="text-xs text-gray-500">
            Podés completar el resto de los datos más adelante editando la reserva.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Reserva *
          </label>
          <select
            value={tipoReservaId}
            onChange={e => setTipoReservaId(e.target.value ? Number(e.target.value) : "")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.tipoReserva ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
            }`}
          >
            <option value="">Seleccionar tipo</option>
            {tiposReserva.map(t => (
              <option key={t.tipoReservaId} value={t.tipoReservaId}>{t.nombre}</option>
            ))}
          </select>
          {errors.tipoReserva && <p className="mt-1 text-sm text-red-600">{errors.tipoReserva}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estado de Reserva *
          </label>
          <select
            value={estadoReservaId}
            onChange={e => setEstadoReservaId(e.target.value ? Number(e.target.value) : "")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.estadoReserva ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
            }`}
          >
            <option value="">Seleccionar estado</option>
            {estadosReserva.map(e => (
              <option key={e.estadoReservaId} value={e.estadoReservaId}>{e.nombre}</option>
            ))}
          </select>
          {errors.estadoReserva && <p className="mt-1 text-sm text-red-600">{errors.estadoReserva}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Seña
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={seña}
            onChange={e => handleSeñaChange(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total a Pagar
          </label>
          <div className="w-full px-3 py-2 border border-gray-200 bg-gray-50 rounded-md text-gray-700">
            {formatMoneda(totalAPagar)}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total Pagado
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={totalPagado}
            onChange={e => setTotalPagado(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder='Comentario sobre la reserva, ej: "Vienen en moto y van a llegar a la noche"'
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className={`mb-4 p-3 rounded-md border ${debe > 0 ? "bg-amber-50 border-amber-200" : "bg-green-50 border-green-200"}`}>
        <span className={`text-sm font-medium ${debe > 0 ? "text-amber-800" : "text-green-800"}`}>
          {debe > 0 ? `Debe: ${formatMoneda(debe)}` : "Sin saldo pendiente"}
        </span>
      </div>

      <div className="mb-2 flex justify-between items-center">
        <h4 className="text-md font-semibold text-gray-900">Unidades Reservadas</h4>
        <button
          type="button"
          onClick={handleAddDetalle}
          className="text-sm text-indigo-600 hover:text-indigo-800"
        >
          + Agregar unidad
        </button>
      </div>
      {errors.detalle && <p className="mb-2 text-sm text-red-600">{errors.detalle}</p>}

      {detalles.map((detalle) => (
        <DetalleReservaRow
          key={detalle.rowId}
          data={detalle}
          onChange={data => handleDetalleChange(detalle.rowId, data)}
          onRemove={() => handleRemoveDetalle(detalle.rowId)}
          conflictError={rowConflicts[detalle.rowId]}
        />
      ))}

      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading || savingInquilino}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading || savingInquilino ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default ReservaForm;
