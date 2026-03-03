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
  console.log("🚀 ~ ComplexForm ~ initialData:", initialData)
  const [formData, setFormData] = useState<Complejo>({
    Nombre: "",
    Direccion: "",
    Telefono: "",
    Descripcion: ""
  });
  const [errors, setErrors] = useState<Partial<Complejo>>({});

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const validate = (): boolean => {
    const newErrors: Partial<Complejo> = {};
    
    if (!formData.Nombre.trim()) {
      newErrors.Nombre = "El nombre es requerido";
    }
    if (!formData.Direccion.trim()) {
      newErrors.Direccion = "La dirección es requerida";
    }
    if (!formData.Telefono.trim()) {
      newErrors.Telefono = "El teléfono es requerido";
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
          name="Nombre"
          value={formData.Nombre}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.Nombre 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="Nombre del complejo"
        />
        {errors.Nombre && (
          <p className="mt-1 text-sm text-red-600">{errors.Nombre}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Dirección *
        </label>
        <input
          type="text"
          name="Direccion"
          value={formData.Direccion}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.Direccion 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="Dirección del complejo"
        />
        {errors.Direccion && (
          <p className="mt-1 text-sm text-red-600">{errors.Direccion}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Teléfono *
        </label>
        <input
          type="text"
          name="Telefono"
          value={formData.Telefono}
          onChange={handleChange}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
            errors.Telefono 
              ? "border-red-500 focus:ring-red-500" 
              : "border-gray-300 focus:ring-indigo-500"
          }`}
          placeholder="Teléfono de contacto"
        />
        {errors.Telefono && (
          <p className="mt-1 text-sm text-red-600">{errors.Telefono}</p>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Descripción
        </label>
        <textarea
          name="Descripcion"
          value={formData.Descripcion}
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
