import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useUnidadesAlojamiento } from "../context/UnidadesAlojamientoContext";
import { useComplejos } from "../context/ComplejosContext";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";
import UnidadAlojamientoCard from "../components/UnidadAlojamientoCard";
import UnidadAlojamientoForm from "../components/UnidadAlojamientoForm";
import Modal from "../components/Modal";

const UnidadesAlojamiento: React.FC = () => {
  const { complejoId } = useParams<{ complejoId: string }>();
  const id = Number(complejoId);

  const { unidades, loading, error, fetchUnidades, addUnidad, editUnidad, removeUnidad } = useUnidadesAlojamiento();
  const { complejos } = useComplejos();
  const complejo = complejos.find(c => c.ComplejoID === id);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnidad, setEditingUnidad] = useState<UnidadAlojamiento | null>(null);
  const [deletingUnidad, setDeletingUnidad] = useState<UnidadAlojamiento | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchUnidades(id);
    }
  }, [id]);

  const handleCreate = () => {
    setEditingUnidad(null);
    setIsModalOpen(true);
  };

  const handleEdit = (unidad: UnidadAlojamiento) => {
    setEditingUnidad(unidad);
    setIsModalOpen(true);
  };

  const handleDelete = (unidad: UnidadAlojamiento) => {
    setDeletingUnidad(unidad);
  };

  const handleConfirmDelete = async () => {
    if (!deletingUnidad?.unidadAlojamientoId) return;

    setIsSubmitting(true);
    try {
      await removeUnidad(deletingUnidad.unidadAlojamientoId);
      setDeletingUnidad(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (formData: UnidadAlojamiento) => {
    setIsSubmitting(true);
    try {
      if (editingUnidad?.unidadAlojamientoId) {
        await editUnidad({ ...formData, unidadAlojamientoId: editingUnidad.unidadAlojamientoId });
      } else {
        await addUnidad(formData);
      }
      setIsModalOpen(false);
      setEditingUnidad(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUnidad(null);
  };

  return (
    <div className="p-6">
      <div className="mb-2">
        <Link to="/panel/complejos" className="text-sm text-indigo-600 hover:text-indigo-800">
          ← Volver a Complejos
        </Link>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Unidades de Alojamiento{complejo ? ` - ${complejo.Nombre}` : ""}
        </h1>
        <button
          onClick={handleCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Unidad
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {loading && unidades.length === 0 ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : unidades.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="mt-4 text-gray-500">No hay unidades de alojamiento registradas</p>
          <button
            onClick={handleCreate}
            className="mt-4 text-indigo-600 hover:text-indigo-800"
          >
            Crear la primera unidad
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unidades.map((unidad) => (
            <UnidadAlojamientoCard
              key={unidad.unidadAlojamientoId}
              unidad={unidad}
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
        title={editingUnidad ? "Editar Unidad de Alojamiento" : "Nueva Unidad de Alojamiento"}
      >
        <UnidadAlojamientoForm
          complejoId={id}
          initialData={editingUnidad || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <Modal
        isOpen={!!deletingUnidad}
        onClose={() => setDeletingUnidad(null)}
        title="Confirmar Eliminación"
      >
        <div className="mt-4">
          <p className="text-gray-600">
            ¿Está seguro de que desea eliminar la unidad{" "}
            <span className="font-semibold">{deletingUnidad?.nombre}</span>?
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <button
              onClick={() => setDeletingUnidad(null)}
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

export default UnidadesAlojamiento;
