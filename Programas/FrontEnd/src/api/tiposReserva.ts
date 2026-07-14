import axios from "axios";
import { getApiUrl } from "../utils/api";
import { TipoReserva } from "../types/TipoReserva";

export const getTiposReserva = async (): Promise<TipoReserva[]> => {
  const response = await axios.get<TipoReserva[]>(`${getApiUrl()}api/tiporeserva/listado`);
  return response.data;
};
