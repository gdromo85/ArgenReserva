import React, { useState, useEffect } from "react";
import { Reserva } from "../types/Reserva";
import { Inquilino } from "../types/Inquilino";
import { TipoReserva } from "../types/TipoReserva";
import { getInquilinos } from "../api/inquilinos";
import { getTiposReserva } from "../api/tiposReserva";
import DetalleReservaRow, { DetalleReservaRowData } from "./DetalleReservaRow";

interface ReservaFormProps {
  initialData?: Reserva;
  onSubmit: (reserva: Reserva) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  inquilino?: string;
  tipoReserva?: string;
  detalle?: string;
}

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

const rowsFromReserva = (reserva?: Reserva): DetalleReservaRowData[] => {
  if (!reserva || reserva.detalleReserva.length === 0) return [emptyDetalleRow()];
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
};

const ReservaForm: React.FC<ReservaFormProps> = ({ initialData, onSubmit, onCancel, isLoading }) => {
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [tiposReserva, setTiposReserva] = useState<TipoReserva[]>([]);
  const [loadingListas, setLoadingListas] = useState(true);

  const [inquilinoId, setInquilinoId] = useState<number | "">(initialData?.inquilino?.inquilinoId ?? "");
  const [tipoReservaId, setTipoReservaId] = useState<number | "">(initialData?.tipoReserva?.tipoReservaId ?? "");
  const [seña, setSeña] = useState<number>(initialData?.seña ?? 0);
  const [totalAPagar, setTotalAPagar] = useState<number>(initialData?.TotalAPagar ?? 0);
  const [totalPagado, setTotalPagado] = useState<number>(initialData?.TotalPagado ?? 0);
  const [detalles, setDetalles] = useState<DetalleReservaRowData[]>(() => rowsFromReserva(initialData));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    Promise.all([getInquilinos(), getTiposReserva()])
      .then(([inq, tipos]) => {
        setInquilinos(inq);
        setTiposReserva(tipos);
      })
      .catch(err => console.error(err))
      .finally(() => setLoadingListas(false));
  }, []);

  useEffect(() => {
    setInquilinoId(initialData?.inquilino?.inquilinoId ?? "");
    setTipoReservaId(initialData?.tipoReserva?.tipoReservaId ?? "");
    setSeña(initialData?.seña ?? 0);
    setTotalAPagar(initialData?.TotalAPagar ?? 0);
    setTotalPagado(initialData?.TotalPagado ?? 0);
    setDetalles(rowsFromReserva(initialData));
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

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    if (!inquilinoId) newErrors.inquilino = "Debe seleccionar un inquilino";
    if (!tipoReservaId) newErrors.tipoReserva = "Debe seleccionar un tipo de reserva";

    const detalleValido = detalles.length > 0 && detalles.every(
      d => d.unidadAlojamiento && d.fechaDesde && d.fechaHasta && d.cantidadPersonas > 0
    );
    if (!detalleValido) newErrors.detalle = "Complete complejo, unidad y fechas de cada unidad reservada";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const inquilino = inquilinos.find(i => i.inquilinoId === inquilinoId)!;
    const tipoReserva = tiposReserva.find(t => t.tipoReservaId === tipoReservaId)!;

    const reserva: Reserva = {
      reservaId: initialData?.reservaId,
      inquilino,
      tipoReserva,
      seña,
      TotalAPagar: totalAPagar,
      TotalPagado: totalPagado,
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Inquilino *
          </label>
          <select
            value={inquilinoId}
            onChange={e => setInquilinoId(e.target.value ? Number(e.target.value) : "")}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
              errors.inquilino ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
            }`}
          >
            <option value="">Seleccionar inquilino</option>
            {inquilinos.map(i => (
              <option key={i.inquilinoId} value={i.inquilinoId}>{i.nombre} {i.Apellido}</option>
            ))}
          </select>
          {errors.inquilino && <p className="mt-1 text-sm text-red-600">{errors.inquilino}</p>}
        </div>

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
            Seña
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={seña}
            onChange={e => setSeña(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Total a Pagar
          </label>
          <input
            type="number"
            min={0}
            step="0.01"
            value={totalAPagar}
            onChange={e => setTotalAPagar(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
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
          disabled={isLoading}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isLoading ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
};

export default ReservaForm;
