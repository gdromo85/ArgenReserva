import React, { useState } from "react";
import { useReservas } from "../context/ReservasContext";
import { Reserva } from "../types/Reserva";
import ReservaCard from "../components/ReservaCard";
import ReservaForm from "../components/ReservaForm";
import Modal from "../components/Modal";

const Reservas: React.FC = () => {
  const { reservas, loading, error, addReserva, editReserva, removeReserva } = useReservas();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReserva, setEditingReserva] = useState<Reserva | null>(null);
  const [deletingReserva, setDeletingReserva] = useState<Reserva | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingReserva(null);
    setIsModalOpen(true);
  };

  const handleEdit = (reserva: Reserva) => {
    setEditingReserva(reserva);
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
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Reservas</h1>
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

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading && reservas.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : reservas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-4 text-gray-500">No hay reservas registradas</p>
          <button
            onClick={handleCreate}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Crear la primera reserva
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservas.map((reserva) => (
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
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

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
              {deletingReserva?.inquilino?.nombre} {deletingReserva?.inquilino?.Apellido}
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
