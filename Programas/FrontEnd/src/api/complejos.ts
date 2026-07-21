import axios from "axios";
import { getApiUrl } from "../utils/api";
import { Complejo } from "../types/Complejo";

const API_ENDPOINT = `${getApiUrl()}api/Complejo`;

export const getComplejoByUsuario = async (id: number): Promise<Complejo[]> => {
  const response = await axios.get<Complejo[]>(`${getApiUrl()}api/complejo/traerComplejoXUsuario/${id}`);
  return response.data;
};

export const getComplejoById = async (id: number): Promise<Complejo> => {
  const response = await axios.get<Complejo>(`${API_ENDPOINT}/${id}`);
  return response.data;
};

export const createComplejo = async (complejo: Complejo, usuarioId: number): Promise<Complejo> => {
  const response = await axios.post<Complejo>(`${getApiUrl()}api/complejo/Agregar/${usuarioId}`, complejo);
  return response.data;
};

export const updateComplejo = async (id: number, complejo: Complejo): Promise<Complejo> => {
  const response = await axios.post<Complejo>(`${getApiUrl()}api/complejo/Editar`, complejo);
  return response.data;
};

export const deleteComplejo = async (id: number, usuarioId: number): Promise<void> => {
  await axios.get(`${getApiUrl()}api/complejo/Eliminar/${id}/${usuarioId}`);
};
