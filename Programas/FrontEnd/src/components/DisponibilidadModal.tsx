import React, { useEffect, useMemo, useState } from "react";
import { useComplejos } from "../context/ComplejosContext";
import { useReservas } from "../context/ReservasContext";
import { getUnidadesAlojamiento } from "../api/unidadAlojamiento";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";
import Modal from "./Modal";
import { PrefillDetalle } from "./ReservaForm";

interface DisponibilidadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReservar: (prefill: PrefillDetalle) => void;
}

interface UnidadConComplejo {
  unidad: UnidadAlojamiento;
  complejoId: number;
  complejoNombre: string;
}

interface SegmentoLibre extends UnidadConComplejo {
  desde: string;
  hasta: string;
}

const ESTADO_QUE_OCUPA = "confirmado";

const hoyISO = (): string => new Date().toISOString().slice(0, 10);

const sumarDias = (fechaISO: string, dias: number): string => {
  const d = new Date(`${fechaISO}T00:00:00`);
  d.setDate(d.getDate() + dias);
  return d.toISOString().slice(0, 10);
};

const formatFecha = (fecha: string): string => {
  const d = new Date(`${fecha}T00:00:00`);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("es-AR");
};

const DisponibilidadModal: React.FC<DisponibilidadModalProps> = ({ isOpen, onClose, onReservar }) => {
  const { complejos } = useComplejos();
  const { reservas } = useReservas();

  const [filtroComplejoId, setFiltroComplejoId] = useState<number | "">("");
  const [filtroCantidadPersonas, setFiltroCantidadPersonas] = useState<number | "">("");
  const [fechaDesde, setFechaDesde] = useState(hoyISO());
  const [fechaHasta, setFechaHasta] = useState(sumarDias(hoyISO(), 2));
  const [unidades, setUnidades] = useState<UnidadConComplejo[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setFechaDesde(hoyISO());
    setFechaHasta(sumarDias(hoyISO(), 2));
    setFiltroComplejoId("");
    setFiltroCantidadPersonas("");
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const complejosAConsultar = filtroComplejoId
      ? complejos.filter(c => c.ComplejoID === filtroComplejoId)
      : complejos;

    setLoadingUnidades(true);
    Promise.all(
      complejosAConsultar.map(c =>
        getUnidadesAlojamiento(c.ComplejoID!).then(unidadesDelComplejo =>
          unidadesDelComplejo.map(unidad => ({ unidad, complejoId: c.ComplejoID!, complejoNombre: c.Nombre }))
        )
      )
    )
      .then(resultados => setUnidades(resultados.flat()))
      .catch(err => console.error(err))
      .finally(() => setLoadingUnidades(false));
  }, [isOpen, filtroComplejoId, complejos]);

  const segmentosLibres = useMemo<SegmentoLibre[]>(() => {
    if (!fechaDesde || !fechaHasta || fechaDesde >= fechaHasta) return [];

    const reservasConfirmadas = reservas.filter(
      r => r.estadoReserva?.nombre?.trim().toLowerCase() === ESTADO_QUE_OCUPA
    );

    const unidadesFiltradas = unidades.filter(({ unidad }) =>
      !filtroCantidadPersonas || unidad.capacidad >= filtroCantidadPersonas
    );

    const resultado: SegmentoLibre[] = [];

    for (const item of unidadesFiltradas) {
      const ocupados = reservasConfirmadas
        .flatMap(r => r.detalleReserva || [])
        .filter(d => d.unidadAlojamiento?.unidadAlojamientoId === item.unidad.unidadAlojamientoId)
        .map(d => ({ desde: d.fechaDesde.slice(0, 10), hasta: d.fechaHasta.slice(0, 10) }))
        .filter(o => o.desde < fechaHasta && fechaDesde < o.hasta)
        .sort((a, b) => (a.desde < b.desde ? -1 : 1));

      const merged: { desde: string; hasta: string }[] = [];
      for (const o of ocupados) {
        const ultimo = merged[merged.length - 1];
        if (ultimo && o.desde <= ultimo.hasta) {
          if (o.hasta > ultimo.hasta) ultimo.hasta = o.hasta;
        } else {
          merged.push({ ...o });
        }
      }

      let cursor = fechaDesde;
      for (const o of merged) {
        const desdeClamp = o.desde > fechaDesde ? o.desde : fechaDesde;
        if (cursor < desdeClamp) {
          resultado.push({ ...item, desde: cursor, hasta: desdeClamp });
        }
        if (o.hasta > cursor) cursor = o.hasta;
      }
      if (cursor < fechaHasta) {
        resultado.push({ ...item, desde: cursor, hasta: fechaHasta });
      }
    }

    return resultado.sort((a, b) => {
      if (a.desde !== b.desde) return a.desde < b.desde ? -1 : 1;
      return a.unidad.nombre.localeCompare(b.unidad.nombre);
    });
  }, [unidades, reservas, fechaDesde, fechaHasta, filtroCantidadPersonas]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Disponibilidad de Unidades" maxWidthClassName="sm:max-w-3xl">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Complejo</label>
          <select
            value={filtroComplejoId}
            onChange={e => setFiltroComplejoId(e.target.value ? Number(e.target.value) : "")}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Todos</option>
            {complejos.map(c => (
              <option key={c.ComplejoID} value={c.ComplejoID}>{c.Nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cant. Personas</label>
          <input
            type="number"
            min={1}
            value={filtroCantidadPersonas}
            onChange={e => setFiltroCantidadPersonas(e.target.value ? Number(e.target.value) : "")}
            placeholder="Cualquiera"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={e => setFechaDesde(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={e => setFechaHasta(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loadingUnidades ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : fechaDesde >= fechaHasta ? (
        <p className="text-center text-gray-500 py-8">La fecha "Hasta" debe ser posterior a "Desde"</p>
      ) : segmentosLibres.length === 0 ? (
        <p className="text-center text-gray-500 py-8">No hay unidades libres para los filtros seleccionados</p>
      ) : (
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
          {segmentosLibres.map((seg, i) => (
            <div key={i} className="flex items-center justify-between py-3 gap-3">
              <div className="min-w-0 flex-1">
                <p className="font-medium text-gray-900">{seg.unidad.nombre} · {seg.complejoNombre}</p>
                <p className="text-sm text-gray-500">
                  Libre del {formatFecha(seg.desde)} al {formatFecha(seg.hasta)} · Capacidad {seg.unidad.capacidad}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onReservar({
                  complejoId: seg.complejoId,
                  unidad: seg.unidad,
                  fechaDesde: seg.desde,
                  fechaHasta: seg.hasta
                })}
                className="shrink-0 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                Reservar
              </button>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};

export default DisponibilidadModal;
