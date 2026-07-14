import React, { useState, useEffect } from "react";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";

interface UnidadAlojamientoFormProps {
  complejoId: number;
  initialData?: UnidadAlojamiento;
  onSubmit: (unidad: UnidadAlojamiento) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

interface FormErrors {
  nombre?: string;
  capacidad?: string;
  precio?: string;
}

const emptyForm = (complejoId: number): UnidadAlojamiento => ({
  complejoId,
  nombre: "",
  capacidad: 1,
  descripcion: "",
  precio: 0
});

const UnidadAlojamientoForm: React.FC<UnidadAlojamientoFormProps> = ({
  complejoId,
  initialData,
  onSubmit,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState<UnidadAlojamiento>(emptyForm(complejoId));
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData(emptyForm(complejoId));
    }
  }, [initialData, complejoId]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.capacidad || formData.capacidad <= 0) {
      newErrors.capacidad = "La capacidad debe ser mayor a 0";
    }
    if (formData.precio < 0) {
      newErrors.precio = "El precio no puede ser negativo";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      await onSubmit(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value
    }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre *
        </label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.nombre
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="Nombre de la unidad"
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Capacidad *
        </label>
        <input
          type="number"
          name="capacidad"
          min={1}
          value={formData.capacidad}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.capacidad
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="Cantidad de personas"
        />
        {errors.capacidad && (
          <p className="mt-1 text-sm text-red-600">{errors.capacidad}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Precio *
        </label>
        <input
          type="number"
          name="precio"
          min={0}
          step="0.01"
          value={formData.precio}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.precio
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="Precio por noche"
        />
        {errors.precio && (
          <p className="mt-1 text-sm text-red-600">{errors.precio}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="descripcion"
          value={formData.descripcion}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Descripción de la unidad de alojamiento"
        />
      </div>

      <div className="flex justify-end gap-3">
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

export default UnidadAlojamientoForm;
