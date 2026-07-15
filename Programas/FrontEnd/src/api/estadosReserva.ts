import axios from "axios";
import { getApiUrl } from "../utils/api";
import { EstadoReserva } from "../types/EstadoReserva";

export const getEstadosReserva = async (): Promise<EstadoReserva[]> => {
  const response = await axios.get<EstadoReserva[]>(`${getApiUrl()}api/estadoReserva/traer`);
  return response.data;
};
