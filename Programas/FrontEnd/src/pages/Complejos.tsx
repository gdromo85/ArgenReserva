import React, { useState } from "react";
import { useComplejos } from "../context/ComplejosContext";
import { Complejo } from "../types/Complejo";
import ComplexCard from "../components/ComplexCard";
import ComplexForm from "../components/ComplexForm";
import Modal from "../components/Modal";

const Complejos: React.FC = () => {
  const { complejos, loading, error, addComplejo, editComplejo, removeComplejo } = useComplejos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComplejo, setEditingComplejo] = useState<Complejo | null>(null);
  const [deletingComplejo, setDeletingComplejo] = useState<Complejo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = () => {
    setEditingComplejo(null);
    setIsModalOpen(true);
  };

  const handleEdit = (complejo: Complejo) => {
    setEditingComplejo(complejo);
    setIsModalOpen(true);
  };

  const handleDelete = (complejo: Complejo) => {
    setDeletingComplejo(complejo);
  };

  const handleConfirmDelete = async () => {
    if (!deletingComplejo?.ComplejoID) return;
    
    setIsSubmitting(true);
    try {
      await removeComplejo(deletingComplejo.ComplejoID);
      setDeletingComplejo(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData: Complejo) => {
    setIsSubmitting(true);
    try {
      if (editingComplejo?.ComplejoID) {
        await editComplejo(editingComplejo.ComplejoID, formData);
      } else {
        await addComplejo(formData);
      }
      setIsModalOpen(false);
      setEditingComplejo(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingComplejo(null);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Complejos</h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nuevo Complejo
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading && complejos.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : complejos.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="mt-4 text-gray-500">No hay complejos registrados</p>
          <button
            onClick={handleCreate}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Crear el primer complejo
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {complejos.map((complejo) => (
            <ComplexCard
              key={complejo.ComplejoID}
              complejo={complejo}
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
        title={editingComplejo ? "Editar Complejo" : "Nuevo Complejo"}
      >
        <ComplexForm
          initialData={editingComplejo || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <Modal
        isOpen={!!deletingComplejo}
        onClose={() => setDeletingComplejo(null)}
        title="Confirmar Eliminación"
      >
        <div className="mt-4">
          <p className="text-gray-600">
            ¿Está seguro de que desea eliminar el complejo{" "}
            <span className="font-semibold">{deletingComplejo?.Nombre}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setDeletingComplejo(null)}
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

export default Complejos;
