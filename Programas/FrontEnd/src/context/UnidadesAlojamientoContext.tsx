import React, { createContext, useContext, useState, ReactNode } from "react";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";
import {
  getUnidadesAlojamiento,
  createUnidadAlojamiento,
  updateUnidadAlojamiento,
  deleteUnidadAlojamiento
} from "../api/unidadAlojamiento";

interface UnidadesAlojamientoContextType {
  unidades: UnidadAlojamiento[];
  loading: boolean;
  error: string | null;
  fetchUnidades: (complejoId: number) => Promise<void>;
  addUnidad: (unidad: UnidadAlojamiento) => Promise<void>;
  editUnidad: (unidad: UnidadAlojamiento) => Promise<void>;
  removeUnidad: (unidadAlojamientoId: number) => Promise<void>;
}

const UnidadesAlojamientoContext = createContext<UnidadesAlojamientoContextType | undefined>(undefined);

interface UnidadesAlojamientoProviderProps {
  children: ReactNode;
}

export const UnidadesAlojamientoProvider: React.FC<UnidadesAlojamientoProviderProps> = ({ children }) => {
  const [unidades, setUnidades] = useState<UnidadAlojamiento[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUnidades = async (complejoId: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getUnidadesAlojamiento(complejoId);
      setUnidades(data);
    } catch (err) {
      setError("Error al cargar las unidades de alojamiento");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addUnidad = async (unidad: UnidadAlojamiento) => {
    setLoading(true);
    setError(null);
    try {
      const nueva = await createUnidadAlojamiento(unidad);
      setUnidades(prev => [...prev, nueva]);
    } catch (err) {
      setError("Error al crear la unidad de alojamiento");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editUnidad = async (unidad: UnidadAlojamiento) => {
    setLoading(true);
    setError(null);
    try {
      const actualizada = await updateUnidadAlojamiento(unidad);
      setUnidades(prev => prev.map(u => u.unidadAlojamientoId === unidad.unidadAlojamientoId ? actualizada : u));
    } catch (err) {
      setError("Error al actualizar la unidad de alojamiento");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeUnidad = async (unidadAlojamientoId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteUnidadAlojamiento(unidadAlojamientoId);
      setUnidades(prev => prev.filter(u => u.unidadAlojamientoId !== unidadAlojamientoId));
    } catch (err) {
      setError("Error al eliminar la unidad de alojamiento");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UnidadesAlojamientoContext.Provider value={{
      unidades,
      loading,
      error,
      fetchUnidades,
      addUnidad,
      editUnidad,
      removeUnidad
    }}>
      {children}
    </UnidadesAlojamientoContext.Provider>
  );
};

export const useUnidadesAlojamiento = (): UnidadesAlojamientoContextType => {
  const context = useContext(UnidadesAlojamientoContext);
  if (!context) {
    throw new Error("useUnidadesAlojamiento must be used within a UnidadesAlojamientoProvider");
  }
  return context;
};
