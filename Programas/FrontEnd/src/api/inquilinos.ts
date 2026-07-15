import axios from "axios";
import { getApiUrl } from "../utils/api";
import { Inquilino } from "../types/Inquilino";

export const createInquilino = async (inquilino: Inquilino): Promise<Inquilino> => {
  const response = await axios.post<Inquilino>(`${getApiUrl()}api/inquilino/agregar`, inquilino);
  return response.data;
};

export const updateInquilino = async (inquilino: Inquilino): Promise<Inquilino> => {
  const response = await axios.post<Inquilino>(`${getApiUrl()}api/inquilino/editar`, inquilino);
  return response.data;
};
