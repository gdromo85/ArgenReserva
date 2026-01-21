/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useCallback, useRef } from "react";
import { fetchData, getApiUrl } from "../utils/api";
import {
  SelectorOption,
  ChipData,
  ColumnMapping,
  listDniDuplicados,
  listDniDuplicadosExportar,
  ControlPaso1,
  ControlPaso2,
} from "../types";

interface UseApiDataState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useApiData = <T>(
  endpoint: string,
  initialData: T,
  dependencies: React.DependencyList = [],
  parseResponse: (data: any) => T = (data) => data,
  shouldFetch: boolean = true
): [UseApiDataState<T>, () => Promise<void>] => {
  const [state, setState] = useState<UseApiDataState<T>>({
    data: initialData,
    loading: false,
    error: null,
  });

  const isInitialMount = useRef(true);
  const lastDependencies = useRef<React.DependencyList>([]);

  const loadData = useCallback(async () => {
    if (!shouldFetch) return;

    setState((prevState) => ({ ...prevState, loading: true, error: null }));
    try {
      const url = `${getApiUrl()}${endpoint}`;
      const result = await fetchData<any>(url);
      //console.log("🚀 ~ loadData ~ result:", result);
      setState({
        data: parseResponse(result),
        loading: false,
        error: null,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      setState({
        data: initialData,
        error: `Error cargando ${endpoint}: ${errorMessage}`,
        loading: false,
      });
      console.warn(
        `Usando datos por defecto para ${endpoint} debido al error:`,
        errorMessage
      );
    }
  }, [endpoint, shouldFetch]); // Solo endpoint y shouldFetch como dependencias

  useEffect(() => {
    // Verificar si las dependencias han cambiado
    const dependenciesChanged =
      isInitialMount.current ||
      dependencies.length !== lastDependencies.current.length ||
      dependencies.some(
        (dep, index) => dep !== lastDependencies.current[index]
      );

    if (dependenciesChanged && shouldFetch) {
      lastDependencies.current = dependencies;
      isInitialMount.current = false;
      loadData();
    }
  }, [loadData, shouldFetch, ...dependencies]);

  return [state, loadData];
};

// Funciones específicas para cargar datos
export const useSelectorOptions1 = () => {
  const [state, reload] = useApiData<SelectorOption[]>(
    "/api/migracion-padron/empresas",
    [],
    [], // Sin dependencias - solo carga al montar
    (data) => {
      if (!Array.isArray(data)) {
        console.error("La respuesta de empresas no es un array válido");
        return [];
      }
      return data.map((option, index) => {
        if (!option.value || !option.label) {
          console.error(
            `Opción en posición ${index} no tiene la estructura correcta`
          );
          return { value: `${index}`, label: `Opción ${index}` };
        }
        return option;
      });
    }
  );

  return {
    selector1Options: state.data || [],
    selector1Loading: state.loading,
    selector1Error: state.error,
    reloadSelector1Options: reload,
  };
};

export const useSelectorOptions2 = (empresa: string) => {
  const shouldFetch = Boolean(empresa && empresa.trim() !== "");

  const [state, reload] = useApiData<SelectorOption[]>(
    `/api/migracion-padron/mutuales?empresa=${empresa}`,
    [],
    [empresa], // Dependencia del parámetro empresa
    (data) => {
      if (!Array.isArray(data)) {
        console.error("La respuesta de mutuales no es un array válido");
        return [];
      }
      return data.map((option, index) => {
        if (!option.value || !option.label) {
          console.error(
            `Opción en posición ${index} no tiene la estructura correcta`
          );
          return { value: `${index}`, label: `Opción ${index}` };
        }
        return option;
      });
    },
    shouldFetch
  );

  return {
    selector2Options: state.data || [],
    selector2Loading: state.loading,
    selector2Error: state.error,
    reloadSelector2Options: reload,
  };
};

export const useChipsData = () => {
  const [state, reload] = useApiData<ChipData[]>(
    "/api/migracion-padron/datos-requeridos",
    [],
    [], // Sin dependencias - solo carga al montar
    (data) => {
      //console.log("🚀 ~ useChipsData ~ data:", data);
      if (!Array.isArray(data)) {
        console.error("La respuesta de chips no es un array válido");
        return [];
      }
      return data.map((chip, index) => {
        if (!chip.id || !chip.label || !chip.color) {
          console.error(
            `Chip en posición ${index} no tiene la estructura correcta`
          );
          return {
            id: `${index}`,
            label: `Campo ${index}`,
            color: "blue",
            valor_json: "",
          };
        }
        return chip;
      });
    }
  );

  return {
    availableChips: state.data || [],
    chipsLoading: state.loading,
    chipsError: state.error,
    reloadChips: reload,
  };
};

export const useEsquemaData = (idCliente: string, idMutual: string) => {
  const shouldFetch = Boolean(
    idCliente && idMutual && idCliente.trim() !== "" && idMutual.trim() !== ""
  );

  const [state, reload] = useApiData<ColumnMapping[]>(
    `/api/migracion-padron/esquemas-datos-importacion?idCliente=${idCliente}&idMutual=${idMutual}`,
    [],
    [idCliente, idMutual], // Dependencias de los parámetros
    (data) => {
      if (data && data.esquema) {
        try {
          return JSON.parse(data.esquema);
        } catch (error) {
          console.error("Error parseando esquema:", error);
          return [];
        }
      }
      return [];
    },
    shouldFetch
  );

  return {
    esquemaData: state.data || [],
    esquemaLoading: state.loading,
    esquemaError: state.error,
    reloadEsquema: reload,
  };
};

export const useSaveEsquema = () => {
  const saveEsquema = useCallback(async (postData: any): Promise<boolean> => {
    try {
      const url = `${getApiUrl()}/api/migracion-padron/esquemas-datos-importacion`;
      await fetchData<any>(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      return true;
    } catch (error) {
      console.error("Error guardando esquema:", error);
      throw error;
    }
  }, []);
  return { saveEsquema };
};

export const useSaveDatosImportacion = () => {
  const saveDatosImportacion = useCallback(
    async (postData: any): Promise<boolean> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/datos-importacion`;
        await fetchData<any>(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
        return true;
      } catch (error) {
        console.error("Error guardando datos de importación:", error);
        throw error;
      }
    },
    []
  );
  return { saveDatosImportacion };
};

export const useBorrarDatosImportacion = () => {
  const borrarDatosImportacion = useCallback(
    async (id_importacion: string): Promise<boolean> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/borrar-datos-importacion?id_importacion=${id_importacion}`;
        await fetchData<any>(url);
        return true;
      } catch (error) {
        console.error("Error borrando datos de importación:", error);
        throw error;
      }
    },
    []
  );
  return { borrarDatosImportacion };
};

export const useContarFilas = (id_importacion: string) => {
  const [state, reload] = useApiData<number>(
    `/api/migracion-padron/cantidad-filas?id_importacion=${id_importacion}`,
    0,
    [], // Sin dependencias - solo carga al montar
    (data) => {
      return data;
    }
  );

  return {
    contarFilas: state.data || 0,
    contarFilasLoading: state.loading,
    contarFilasError: state.error,
    reloadContarFilas: reload,
  };
};

export const useTraerDniDuplicados = () => {
  const traerDniDuplicados = useCallback(
    async (id_importacion: string): Promise<listDniDuplicados[]> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/dni-duplicados?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url);

        return result;
      } catch (error) {
        console.error("Error guardando datos de importación:", error);
        throw error;
      }
    },
    []
  );

  const traerDniDuplicadosExportar = useCallback(
    async (id_importacion: string): Promise<listDniDuplicadosExportar[]> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/dni-duplicados-list?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url);

        return result;
      } catch (error) {
        console.error("Error guardando datos de importación:", error);
        throw error;
      }
    },
    []
  );

  const borrarDniDuplicados = useCallback(
    async (id_importacion: string): Promise<listDniDuplicadosExportar[]> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/dni-duplicados?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        return result;
      } catch (error) {
        console.error("Error guardando datos de importación:", error);
        throw error;
      }
    },
    []
  );

  return {
    traerDniDuplicados,
    traerDniDuplicadosExportar,
    borrarDniDuplicados,
  };
};

export const useDniVacios = () => {
  const traerDniVacios = useCallback(
    async (id_importacion: string): Promise<listDniDuplicadosExportar[]> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/dni-vacios?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url);

        return result;
      } catch (error) {
        console.error("Error guardando datos de importación:", error);
        throw error;
      }
    },
    []
  );

  const borrarDniVacios = useCallback(
    async (id_importacion: string): Promise<listDniDuplicadosExportar[]> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/dni-vacios?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        });

        return result;
      } catch (error) {
        console.error("Error guardando datos de importación:", error);
        throw error;
      }
    },
    []
  );

  return {
    traerDniVacios,
    borrarDniVacios,
  };
};

export const usePaso1 = () => {
  const ejecutarPaso1 = useCallback(
    async (id_importacion: string): Promise<boolean> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/paso1?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url);

        return result;
      } catch (error) {
        console.error("Error guardando datos de Paso1:", error);
        throw error;
      }
    },
    []
  );

  const controlPaso1 = useCallback(
    async (id_importacion: string): Promise<ControlPaso1> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/control-paso1?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url);
        console.log("🚀 ~ usePaso1 ~ result:", result[0]);

        const nombresDePropiedades = Object.keys(result[0]);

        const valoresDePropiedades = Object.values(result[0]);
        let afiliadosBaja = 0;
        let respuesta = "";
        let correcto = true;
        for (let i = 0; i < nombresDePropiedades.length; i++) {
          const nombre = nombresDePropiedades[i];
          const valor = valoresDePropiedades[i];

          //console.log(`Propiedad: ${nombre}, Valor: ${valor} `);
          if (nombre === "afiliados_de_baja") {
            afiliadosBaja = Number(valor);
            if (Number(valor) > 150) correcto = false;
          } else {
            //if (valor !== '0') {
            respuesta = respuesta + `${nombre} = ${valor}\n`;
            if (Number(valor) > 0) correcto = false;
            //}
          }
        }

        return { respuesta, afiliadosBaja, correcto };
      } catch (error) {
        console.error("Error control-paso1:", error);
        throw error;
      }
    },
    []
  );

  return {
    ejecutarPaso1,
    controlPaso1,
  };
};

export const useSaveLogsAcciones = () => {
  const saveLogsAcciones = useCallback(
    async (postData: any): Promise<boolean> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/logs-acciones-importacion`;
        await fetchData<any>(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(postData),
        });
        return true;
      } catch (error) {
        console.error("Error guardando LogsAcciones:", error);
        throw error;
      }
    },
    []
  );
  return { saveLogsAcciones };
};

export const usePaso2 = () => {
  const ejecutarPaso2 = useCallback(
    async (id_importacion: string): Promise<boolean> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/paso2?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url);

        return result;
      } catch (error) {
        console.error("Error guardando datos de Paso2:", error);
        throw error;
      }
    },
    []
  );

  const contarPaso2Realizados = useCallback(
    async (id_importacion: string): Promise<number> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/paso2-realizados?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url);

        return result;
      } catch (error) {
        console.error("Error paso2Realizados:", error);
        throw error;
      }
    },
    []
  );

  const controlPaso2 = useCallback(
    async (id_importacion: string): Promise<ControlPaso2> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/control-paso2?id_importacion=${id_importacion}`;
        const result = await fetchData<any>(url);
        console.log("🚀 ~ usePaso2 ~ controlPaso2 - result:", result[0]);

        const nombresDePropiedades = Object.keys(result[0]);

        const valoresDePropiedades = Object.values(result[0]);
        
        let respuesta = "";
        let correcto = true;
        for (let i = 0; i < nombresDePropiedades.length; i++) {
          const nombre = nombresDePropiedades[i];
          const valor = valoresDePropiedades[i];        
          //if (valor !== '0') {
          respuesta = respuesta + `${nombre} = ${valor}\n`;
          if (Number(valor) > 0) correcto = false;
          //}
          
        }

        return { respuesta, correcto };
      } catch (error) {
        console.error("Error control-paso1:", error);
        throw error;
      }
    },
    []
  );

  return {
    ejecutarPaso2,
    contarPaso2Realizados,
    controlPaso2,
  };
};
export const useTempPadronGeneralExiste = () => {
  const tempPadronGeneralExiste = useCallback(
    async (id_importacion: string): Promise<boolean> => {
      try {
        const url = `${getApiUrl()}/api/migracion-padron/temp-padron-general-existe?id_importacion=${id_importacion}`;
        const respuesta = await fetchData<any>(url);
        console.log("🚀 ~ useTempPadronGeneralExiste ~ respuesta:", respuesta)
        return respuesta;
      } catch (error) {
        console.error("Error borrando datos de importación:", error);
        throw error;
      }
    },
    []
  );
  return { tempPadronGeneralExiste };
};
