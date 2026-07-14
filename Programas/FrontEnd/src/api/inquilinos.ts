import axios from "axios";
import { getApiUrl } from "../utils/api";
import { Inquilino } from "../types/Inquilino";

export const getInquilinos = async (): Promise<Inquilino[]> => {
  const response = await axios.get<Inquilino[]>(`${getApiUrl()}api/inquilino/listado`);
  return response.data;
};
