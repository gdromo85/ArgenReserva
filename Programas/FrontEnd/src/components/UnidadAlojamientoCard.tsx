import React from "react";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";

interface UnidadAlojamientoCardProps {
  unidad: UnidadAlojamiento;
  onEdit: (unidad: UnidadAlojamiento) => void;
  onDelete: (unidad: UnidadAlojamiento) => void;
}

const formatPrecio = (precio: number): string =>
  precio.toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const UnidadAlojamientoCard: React.FC<UnidadAlojamientoCardProps> = ({ unidad, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {unidad.nombre}
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(unidad)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title="Editar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(unidad)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Eliminar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 10-8 0" />
          </svg>
          <span className="text-gray-600">Capacidad: {unidad.capacidad}</span>
        </div>

        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="text-gray-600">{formatPrecio(unidad.precio)}</span>
        </div>

        {unidad.descripcion && (
          <div className="flex items-start gap-2">
            <svg className="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            <span className="text-gray-600">{unidad.descripcion}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnidadAlojamientoCard;
