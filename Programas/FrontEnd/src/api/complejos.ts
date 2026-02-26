import axios from "axios";
import { getApiUrl } from "../utils/api";
import { Complejo } from "../types/Complejo";

const API_ENDPOINT = `${getApiUrl()}api/Complejo`;

export const getComplejos = async (): Promise<Complejo[]> => {
  const response = await axios.get<Complejo[]>(`${getApiUrl()}api/complejo/listado`);
  console.log("🚀 ~ getComplejos ~ response:", response)
  return response.data;
};

export const getComplejoById = async (id: number): Promise<Complejo> => {
  const response = await axios.get<Complejo>(`${API_ENDPOINT}/${id}`);
  return response.data;
};

export const createComplejo = async (complejo: Complejo): Promise<Complejo> => {
  const response = await axios.post<Complejo>(API_ENDPOINT, complejo);
  return response.data;
};

export const updateComplejo = async (id: number, complejo: Complejo): Promise<Complejo> => {
  const response = await axios.put<Complejo>(`${API_ENDPOINT}/${id}`, complejo);
  return response.data;
};

export const deleteComplejo = async (id: number): Promise<void> => {
  await axios.delete(`${API_ENDPOINT}/${id}`);
};
