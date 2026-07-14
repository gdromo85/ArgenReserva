import axios from "axios";
import { getApiUrl } from "../utils/api";
import { Reserva } from "../types/Reserva";

export const getReservas = async (): Promise<Reserva[]> => {
  const response = await axios.get<Reserva[]>(`${getApiUrl()}api/reserva/listado`);
  return response.data;
};

export const getReservaById = async (id: number): Promise<Reserva> => {
  const response = await axios.get<Reserva>(`${getApiUrl()}api/reserva/${id}`);
  return response.data;
};

export const createReserva = async (reserva: Reserva): Promise<Reserva> => {
  const response = await axios.post<Reserva>(`${getApiUrl()}api/reserva/agregar`, reserva);
  return response.data;
};

export const updateReserva = async (reserva: Reserva): Promise<Reserva> => {
  const response = await axios.post<Reserva>(`${getApiUrl()}api/reserva/editar`, reserva);
  return response.data;
};

export const deleteReserva = async (id: number): Promise<boolean> => {
  const response = await axios.get<boolean>(`${getApiUrl()}api/reserva/eliminar/${id}`);
  return response.data;
};
