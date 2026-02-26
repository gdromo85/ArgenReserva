import React, { useState, useEffect } from "react";
import { Complejo } from "../types/Complejo";

interface ComplexFormProps {
  initialData?: Complejo;
  onSubmit: (complejo: Complejo) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const ComplexForm: React.FC<ComplexFormProps> = ({ 
  initialData, 
  onSubmit, 
  onCancel,
  isLoading 
}) => {
  const [formData, setFormData] = useState<Complejo>({
    nombre: "",
    direccion: "",
    telefono: "",
    descripcion: ""
  });
  const [errors, setErrors] = useState<Partial<Complejo>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Complejo> = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es requerido";
    }
    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es requerida";
    }
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es requerido";
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
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof Complejo]) {
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
          placeholder="Nombre del complejo"
        />
        {errors.nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.nombre}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección *
        </label>
        <input
          type="text"
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.direccion 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="Dirección del complejo"
        />
        {errors.direccion && (
          <p className="mt-1 text-sm text-red-600">{errors.direccion}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono *
        </label>
        <input
          type="text"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.telefono 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="Teléfono de contacto"
        />
        {errors.telefono && (
          <p className="mt-1 text-sm text-red-600">{errors.telefono}</p>
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
          placeholder="Descripción del complejo"
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

export default ComplexForm;
