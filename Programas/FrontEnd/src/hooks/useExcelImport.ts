import { useState } from "react";
import * as XLSX from "xlsx";
import { ExcelData } from "../types";

export const useExcelImport = () => {
  const [data, setData] = useState<ExcelData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const importFile = async (file: File) => {
    setLoading(true);
    setError(null);
    setData([]);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: "array", cellDates: true });

      
      // Get the first worksheet
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      

      // Convert to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      console.log("🚀 ~ importFile ~ jsonData:", jsonData)
      

      if (jsonData.length === 0) {
        throw new Error("El archivo está vacío o no contiene datos válidos");
      }

      setData(jsonData as ExcelData[]);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error al procesar el archivo"
      );
    } finally {
      setLoading(false);
    }
  };

  const clearData = () => {
    setData([]);
    setError(null);
  };

  return {
    data,
    loading,
    error,
    importFile,
    clearData,
  };
};
