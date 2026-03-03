import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Complejo } from "../types/Complejo";
import { getComplejos, createComplejo, updateComplejo, deleteComplejo, getComplejoByUsuario } from "../api/complejos";

interface ComplejosContextType {
  complejos: Complejo[];
  complejosXUsuario: Complejo[];
  loading: boolean;
  error: string | null;
  fetchComplejos: () => Promise<void>;
  addComplejo: (complejo: Complejo) => Promise<void>;
  editComplejo: (id: number, complejo: Complejo) => Promise<void>;
  removeComplejo: (id: number) => Promise<void>;
  fetchComplejosXUsuario: (usuario: number) => Promise<void>;
}

const ComplejosContext = createContext<ComplejosContextType | undefined>(undefined);

interface ComplejosProviderProps {
  children: ReactNode;
}

export const ComplejosProvider: React.FC<ComplejosProviderProps> = ({ children }) => {
  const [complejos, setComplejos] = useState<Complejo[]>([]);
  const [complejosXUsuario, setComplejosXUsuario] = useState<Complejo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchComplejos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComplejos();
      setComplejos(data);
    } catch (err) {
      setError("Error al cargar los complejos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchComplejosXUsuario = async (usuario: number) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getComplejoByUsuario(usuario);
      setComplejosXUsuario(data);
    } catch (err) {
      setError("Error al cargar los complejos");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addComplejo = async (complejo: Complejo) => {
    setLoading(true);
    setError(null);
    try {
      const nuevo = await createComplejo(complejo);
      setComplejos(prev => [...prev, nuevo]);
    } catch (err) {
      setError("Error al crear el complejo");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editComplejo = async (id: number, complejo: Complejo) => {
    setLoading(true);
    setError(null);
    try {
      const actualizado = await updateComplejo(id, complejo);
      setComplejos(prev => prev.map(c => c.ComplejoID === id ? actualizado : c));
    } catch (err) {
      setError("Error al actualizar el complejo");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeComplejo = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteComplejo(id);
      setComplejos(prev => prev.filter(c => c.ComplejoID !== id));
    } catch (err) {
      setError("Error al eliminar el complejo");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplejos();
  }, []);

  return (
    <ComplejosContext.Provider value={{
      complejos,
      complejosXUsuario,
      loading,
      error,
      fetchComplejos,
      addComplejo,
      editComplejo,
      removeComplejo,
      fetchComplejosXUsuario
    }}>
      {children}
    </ComplejosContext.Provider>
  );
};

export const useComplejos = (): ComplejosContextType => {
  const context = useContext(ComplejosContext);
  if (!context) {
    throw new Error("useComplejos must be used within a ComplejosProvider");
  }
  return context;
};
