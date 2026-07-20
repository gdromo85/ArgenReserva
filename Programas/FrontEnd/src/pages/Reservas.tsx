import React, { useEffect, useMemo, useState } from "react";
import { useReservas } from "../context/ReservasContext";
import { useComplejos } from "../context/ComplejosContext";
import { getUnidadesAlojamiento } from "../api/unidadAlojamiento";
import { getEstadosReserva } from "../api/estadosReserva";
import { Reserva } from "../types/Reserva";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";
import { EstadoReserva } from "../types/EstadoReserva";
import ReservaCard from "../components/ReservaCard";
import ReservaForm, { PrefillDetalle } from "../components/ReservaForm";
import DisponibilidadModal from "../components/DisponibilidadModal";
import CalendarioModal from "../components/CalendarioModal";
import Modal from "../components/Modal";

const hoyISO = (): string => new Date().toISOString().slice(0, 10);

const sumarUnMesISO = (fechaISO: string): string => {
  const [y, m, d] = fechaISO.split("-").map(Number);
  const fecha = new Date(y, m, d);
  return `${fecha.getFullYear()}-${String(fecha.getMonth() + 1).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
};

const Reservas: React.FC = () => {
  const { reservas, loading, error, addReserva, editReserva, removeReserva } = useReservas();
  const { complejos } = useComplejos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDisponibilidadOpen, setIsDisponibilidadOpen] = useState(false);
  const [isCalendarioOpen, setIsCalendarioOpen] = useState(false);
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null);
  const [deletingReserva, setDeletingReserva] = useState<Reserva | null>(null);
  const [prefillDetalle, setPrefillDetalle] = useState<PrefillDetalle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [filtroComplejoId, setFiltroComplejoId] = useState<number | "">("");
  const [filtroUnidadId, setFiltroUnidadId] = useState<number | "">("");
  const [filtroEstadoId, setFiltroEstadoId] = useState<number | "">("");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState(() => hoyISO());
  const [filtroFechaHasta, setFiltroFechaHasta] = useState(() => sumarUnMesISO(hoyISO()));
  const [unidadesFiltro, setUnidadesFiltro] = useState<UnidadAlojamiento[]>([]);
  const [estadosFiltro, setEstadosFiltro] = useState<EstadoReserva[]>([]);

  useEffect(() => {
    getEstadosReserva()
      .then(setEstadosFiltro)
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    if (!filtroComplejoId) {
      setUnidadesFiltro([]);
      return;
    }
    getUnidadesAlojamiento(Number(filtroComplejoId))
      .then(setUnidadesFiltro)
      .catch(err => console.error(err));
  }, [filtroComplejoId]);

  const hayFiltrosActivos = !!(filtroComplejoId || filtroUnidadId || filtroEstadoId || filtroFechaDesde || filtroFechaHasta);

  const handleLimpiarFiltros = () => {
    setFiltroComplejoId("");
    setFiltroUnidadId("");
    setFiltroEstadoId("");
    setFiltroFechaDesde("");
    setFiltroFechaHasta("");
  };

  const primeraFecha = (reserva: Reserva): string => {
    const fechas = (reserva.detalleReserva || []).map(d => d.fechaDesde?.slice(0, 10)).filter(Boolean).sort();
    return fechas[0] ?? "9999-99-99";
  };

  const reservasFiltradas = useMemo(() => {
    const filtradas = !hayFiltrosActivos
      ? reservas
      : reservas.filter(reserva => {
          if (filtroEstadoId && reserva.estadoReserva?.estadoReservaId !== filtroEstadoId) return false;

          if (!filtroComplejoId && !filtroUnidadId && !filtroFechaDesde && !filtroFechaHasta) return true;

          return (reserva.detalleReserva || []).some(d => {
            if (filtroUnidadId && d.unidadAlojamiento?.unidadAlojamientoId !== filtroUnidadId) return false;
            if (!filtroUnidadId && filtroComplejoId && d.unidadAlojamiento?.complejoId !== filtroComplejoId) return false;

            const desde = d.fechaDesde?.slice(0, 10);
            const hasta = d.fechaHasta?.slice(0, 10);
            if (filtroFechaDesde && hasta && hasta < filtroFechaDesde) return false;
            if (filtroFechaHasta && desde && desde > filtroFechaHasta) return false;

            return true;
          });
        });

    return [...filtradas].sort((a, b) => primeraFecha(a).localeCompare(primeraFecha(b)));
  }, [reservas, hayFiltrosActivos, filtroComplejoId, filtroUnidadId, filtroEstadoId, filtroFechaDesde, filtroFechaHasta]);

  const handleCreate = () => {
    setEditingReserva(null);
    setPrefillDetalle(null);
    setIsModalOpen(true);
  };

  const handleEdit = (reserva: Reserva) => {
    setEditingReserva(reserva);
    setPrefillDetalle(null);
    setIsModalOpen(true);
  };

  const handleReservarPrefill = (prefill: PrefillDetalle) => {
    setEditingReserva(null);
    setPrefillDetalle(prefill);
    setIsDisponibilidadOpen(false);
    setIsCalendarioOpen(false);
    setIsModalOpen(true);
  };

  const handleDelete = (reserva: Reserva) => {
    setDeletingReserva(reserva);
  };

  const handleConfirmDelete = async () => {
    if (!deletingReserva?.reservaId) return;

    setIsSubmitting(true);
    try {
      await removeReserva(deletingReserva.reservaId);
      setDeletingReserva(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData: Reserva) => {
    setIsSubmitting(true);
    try {
      if (editingReserva?.reservaId) {
        await editReserva({ ...formData, reservaId: editingReserva.reservaId });
      } else {
        await addReserva(formData);
      }
      setIsModalOpen(false);
      setEditingReserva(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingReserva(null);
    setPrefillDetalle(null);
  };

  return (
    <div className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setIsCalendarioOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Ver Calendario
          </button>
          <button
            onClick={() => setIsDisponibilidadOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Ver Disponibilidad
          </button>
          <button
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Reserva
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Complejo</label>
            <select
              value={filtroComplejoId}
              onChange={e => {
                setFiltroComplejoId(e.target.value ? Number(e.target.value) : "");
                setFiltroUnidadId("");
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos</option>
              {complejos.map(c => (
                <option key={c.ComplejoID} value={c.ComplejoID}>{c.Nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unidad de Alojamiento</label>
            <select
              value={filtroUnidadId}
              onChange={e => setFiltroUnidadId(e.target.value ? Number(e.target.value) : "")}
              disabled={!filtroComplejoId}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
            >
              <option value="">Todas</option>
              {unidadesFiltro.map(u => (
                <option key={u.unidadAlojamientoId} value={u.unidadAlojamientoId}>{u.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={filtroEstadoId}
              onChange={e => setFiltroEstadoId(e.target.value ? Number(e.target.value) : "")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Todos</option>
              {estadosFiltro.map(e => (
                <option key={e.estadoReservaId} value={e.estadoReservaId}>{e.nombre}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
            <input
              type="date"
              value={filtroFechaDesde}
              onChange={e => setFiltroFechaDesde(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
            <input
              type="date"
              value={filtroFechaHasta}
              onChange={e => setFiltroFechaHasta(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {hayFiltrosActivos && (
          <div className="mt-3">
            <button
              type="button"
              onClick={handleLimpiarFiltros}
              className="text-sm text-indigo-600 hover:text-indigo-800"
            >
              Limpiar filtros
            </button>
          </div>
        )}
      </div>

      {loading && reservas.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : reservasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-gray-500">
            {hayFiltrosActivos ? "No hay reservas que coincidan con los filtros" : "No hay reservas registradas"}
          </p>
          {!hayFiltrosActivos && (
            <button
              onClick={handleCreate}
              className="mt-4 text-indigo-600 hover:text-indigo-800"
            >
              Crear la primera reserva
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservasFiltradas.map((reserva) => (
            <ReservaCard
              key={reserva.reservaId}
              reserva={reserva}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Modal para Crear/Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingReserva ? "Editar Reserva" : "Nueva Reserva"}
        maxWidthClassName="sm:max-w-3xl"
      >
        <ReservaForm
          initialData={editingReserva || undefined}
          prefillDetalle={prefillDetalle || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      <DisponibilidadModal
        isOpen={isDisponibilidadOpen}
        onClose={() => setIsDisponibilidadOpen(false)}
        onReservar={handleReservarPrefill}
      />

      <CalendarioModal
        isOpen={isCalendarioOpen}
        onClose={() => setIsCalendarioOpen(false)}
        onReservar={handleReservarPrefill}
      />

      {/* Modal de Confirmación para Eliminar */}
      <Modal
        isOpen={!!deletingReserva}
        onClose={() => setDeletingReserva(null)}
        title="Confirmar Eliminación"
      >
        <div className="mt-4">
          <p className="text-gray-600">
            ¿Está seguro de que desea eliminar la reserva de{" "}
            <span className="font-semibold">
              {deletingReserva?.inquilino?.nombre} {deletingReserva?.inquilino?.apellido}
            </span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setDeletingReserva(null)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:opacity-50"
            >
              {isSubmitting ? "Eliminando..." : "Eliminar"}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Reservas;
