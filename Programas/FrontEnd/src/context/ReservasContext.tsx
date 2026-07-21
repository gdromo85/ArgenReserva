import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Reserva } from "../types/Reserva";
import { getReservasXUsuario, createReserva, updateReserva, deleteReserva } from "../api/reservas";
import { useAuth } from "./AuthContext";

interface ReservasContextType {
  reservas: Reserva[];
  loading: boolean;
  error: string | null;
  fetchReservas: () => Promise<void>;
  addReserva: (reserva: Reserva) => Promise<void>;
  editReserva: (reserva: Reserva) => Promise<void>;
  removeReserva: (reservaId: number) => Promise<void>;
}

const ReservasContext = createContext<ReservasContextType | undefined>(undefined);

interface ReservasProviderProps {
  children: ReactNode;
}

export const ReservasProvider: React.FC<ReservasProviderProps> = ({ children }) => {
  const { usuario, loading: authLoading } = useAuth();
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchReservas = async () => {
    if (!usuario) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getReservasXUsuario(usuario.usuarioID);
      setReservas(data);
    } catch (err) {
      setError("Error al cargar las reservas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addReserva = async (reserva: Reserva) => {
    setLoading(true);
    setError(null);
    try {
      const nueva = await createReserva(reserva);
      setReservas(prev => [...prev, nueva]);
    } catch (err) {
      setError("Error al crear la reserva");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editReserva = async (reserva: Reserva) => {
    setLoading(true);
    setError(null);
    try {
      const actualizada = await updateReserva(reserva);
      setReservas(prev => prev.map(r => r.reservaId === reserva.reservaId ? actualizada : r));
    } catch (err) {
      setError("Error al actualizar la reserva");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeReserva = async (reservaId: number) => {
    setLoading(true);
    setError(null);
    try {
      await deleteReserva(reservaId);
      setReservas(prev => prev.filter(r => r.reservaId !== reservaId));
    } catch (err) {
      setError("Error al eliminar la reserva");
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (usuario) {
      fetchReservas();
    } else {
      setReservas([]);
    }
  }, [usuario, authLoading]);

  return (
    <ReservasContext.Provider value={{
      reservas,
      loading,
      error,
      fetchReservas,
      addReserva,
      editReserva,
      removeReserva
    }}>
      {children}
    </ReservasContext.Provider>
  );
};

export const useReservas = (): ReservasContextType => {
  const context = useContext(ReservasContext);
  if (!context) {
    throw new Error("useReservas must be used within a ReservasProvider");
  }
  return context;
};
