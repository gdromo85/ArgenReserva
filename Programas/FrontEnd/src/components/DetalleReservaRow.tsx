import React, { useEffect, useState } from "react";
import { useComplejos } from "../context/ComplejosContext";
import { getUnidadesAlojamiento } from "../api/unidadAlojamiento";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";

export interface DetalleReservaRowData {
  rowId: string;
  detalleReservaId?: number;
  complejoId: number | "";
  unidadAlojamiento: UnidadAlojamiento | null;
  precioACobrar: number;
  cantidadPersonas: number;
  fechaDesde: string;
  fechaHasta: string;
}

interface DetalleReservaRowProps {
  data: DetalleReservaRowData;
  onChange: (data: DetalleReservaRowData) => void;
  onRemove: () => void;
}

const DetalleReservaRow: React.FC<DetalleReservaRowProps> = ({ data, onChange, onRemove }) => {
  const { complejos } = useComplejos();
  const [unidades, setUnidades] = useState<UnidadAlojamiento[]>([]);
  const [loadingUnidades, setLoadingUnidades] = useState(false);

  useEffect(() => {
    if (!data.complejoId) {
      setUnidades([]);
      return;
    }
    setLoadingUnidades(true);
    getUnidadesAlojamiento(Number(data.complejoId))
      .then(setUnidades)
      .catch(err => console.error(err))
      .finally(() => setLoadingUnidades(false));
  }, [data.complejoId]);

  const handleComplejoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const complejoId = e.target.value ? Number(e.target.value) : "";
    onChange({ ...data, complejoId, unidadAlojamiento: null });
  };

  const handleUnidadChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const unidad = unidades.find(u => u.unidadAlojamientoId === Number(e.target.value)) || null;
    onChange({
      ...data,
      unidadAlojamiento: unidad,
      precioACobrar: unidad ? unidad.precio : data.precioACobrar
    });
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    onChange({ ...data, [name]: type === "number" ? Number(value) : value });
  };

  return (
    <div className="border border-gray-200 rounded-md p-4 mb-4">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onRemove}
          className="text-red-600 hover:text-red-800 text-sm"
        >
          Quitar
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Complejo *
          </label>
          <select
            value={data.complejoId}
            onChange={handleComplejoChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">Seleccionar complejo</option>
            {complejos.map(c => (
              <option key={c.ComplejoID} value={c.ComplejoID}>{c.Nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unidad de Alojamiento *
          </label>
          <select
            value={data.unidadAlojamiento?.unidadAlojamientoId ?? ""}
            onChange={handleUnidadChange}
            disabled={!data.complejoId || loadingUnidades}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100"
          >
            <option value="">{loadingUnidades ? "Cargando..." : "Seleccionar unidad"}</option>
            {unidades.map(u => (
              <option key={u.unidadAlojamientoId} value={u.unidadAlojamientoId}>{u.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Desde *
          </label>
          <input
            type="date"
            name="fechaDesde"
            value={data.fechaDesde}
            onChange={handleFieldChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Hasta *
          </label>
          <input
            type="date"
            name="fechaHasta"
            value={data.fechaHasta}
            onChange={handleFieldChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Cantidad de Personas *
          </label>
          <input
            type="number"
            name="cantidadPersonas"
            min={1}
            value={data.cantidadPersonas}
            onChange={handleFieldChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Precio a Cobrar *
          </label>
          <input
            type="number"
            name="precioACobrar"
            min={0}
            step="0.01"
            value={data.precioACobrar}
            onChange={handleFieldChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default DetalleReservaRow;
