import axios from "axios";
import { getApiUrl } from "../utils/api";
import { UnidadAlojamiento } from "../types/UnidadAlojamiento";

export const getUnidadesAlojamiento = async (complejoId: number): Promise<UnidadAlojamiento[]> => {
  const response = await axios.get<UnidadAlojamiento[]>(`${getApiUrl()}api/UnidadAlojamiento/traerTodos/${complejoId}`);
  return response.data;
};

export const createUnidadAlojamiento = async (unidad: UnidadAlojamiento): Promise<UnidadAlojamiento> => {
  const response = await axios.post<UnidadAlojamiento>(`${getApiUrl()}api/UnidadAlojamiento/Agregar`, unidad);
  return response.data;
};

export const updateUnidadAlojamiento = async (unidad: UnidadAlojamiento): Promise<UnidadAlojamiento> => {
  const response = await axios.post<UnidadAlojamiento>(`${getApiUrl()}api/UnidadAlojamiento/Editar`, unidad);
  return response.data;
};

export const deleteUnidadAlojamiento = async (id: number): Promise<boolean> => {
  const response = await axios.get<boolean>(`${getApiUrl()}api/UnidadAlojamiento/eliminar/${id}`);
  return response.data;
};
