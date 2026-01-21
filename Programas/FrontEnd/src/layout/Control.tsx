/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

import {
  useContarFilas,
  useTraerDniDuplicados,
  useDniVacios,
  usePaso1,
  useSaveLogsAcciones,
  usePaso2,
  useBorrarDatosImportacion,
} from "../hooks/useApiData";

import { listDniDuplicadosExportar } from "../types";

import { getColorTailwind } from "../helper/getColor";
import { useNavigate } from "react-router";

const StyledCardsPage = () => {
  const navigate = useNavigate();
  const { saveLogsAcciones } = useSaveLogsAcciones();
  const {
    traerDniDuplicados,
    traerDniDuplicadosExportar,
    borrarDniDuplicados,
  } = useTraerDniDuplicados();
  const { traerDniVacios, borrarDniVacios } = useDniVacios();
  const { ejecutarPaso1, controlPaso1 } = usePaso1();

  const { ejecutarPaso2, contarPaso2Realizados, controlPaso2 } = usePaso2();

  const [estado1, setEstado1] = useState("Realizar");
  const [estadoVacio, setEstadoVacio] = useState("Realizar");
  const [estadoPaso1, setEstadoPaso1] = useState("Realizar");
  const [estadoControlPaso1, setEstadoControlPaso1] = useState("Realizar");

  const [estadoPaso2, setEstadoPaso2] = useState("Realizar");

  const [traerDniDuplicadosLoading, setTraerDniDuplicadosLoading] =
    useState(false);
  const [traerDniVaciosLoading, setTraerDniVaciosLoading] = useState(false);
  const [paso1Loading, setPaso1Loading] = useState(false);
  const [controlPaso1Loading, setControlPaso1Loading] = useState(false);
  const [respuesta1, setRespuesta1] = useState("");
  const [respuestaVacios, setRespuestaVacios] = useState("");
  const [respuestaPaso1, setRespuestaPaso1] = useState("");
  const [respuestaControlPaso1, setRespuestaControlPaso1] = useState("");
  const [afiliadosBajaControlPaso1, setAfiliadosBajaControlPaso1] = useState(0);

  const [textBtnEstado1, setTextBtnEstado1] = useState("Controlar");
  const [textBtnEstadoVacio, setTextBtnEstadoVacio] = useState("Controlar");

  const [textBtnEstadoPaso1, setTextBtnEstadoPaso1] = useState("Ejecutar");
  const [textBtnControlPaso1, setTextBtnControlPaso1] = useState("Ejecutar");

  const [paso2Loading, setPaso2Loading] = useState(false);
  const [respuestaPaso2, setRespuestaPaso2] = useState("");
  const [textBtnEstadoPaso2, setTextBtnEstadoPaso2] = useState("Ejecutar");

  const [dniVacios, setDniVacios] = useState<listDniDuplicadosExportar[]>([]);
  const [chatidLoc, setChatidLoc] = useState("");
  const [filasContar, setFilasContar] = useState(0);
  const {
    contarFilas,
    contarFilasLoading,
    //contarFilasError,
    reloadContarFilas,
  } = useContarFilas(chatidLoc);

  const [paso2Realizados, setPaso2Realizados] = useState(0);
  const [paso2RealizadosPorcentaje, setPaso2RealizadosPorcentaje] = useState(0);

  const [estadoControlPaso2, setEstadoControlPaso2] = useState("Realizar");
  const [respuestaControlPaso2, setRespuestaControlPaso2] = useState("");
  const [controlPaso2Loading, setControlPaso2Loading] = useState(false);
  const [textBtnControlPaso2, setTextBtnControlPaso2] = useState("Ejecutar");

  const { borrarDatosImportacion } = useBorrarDatosImportacion();

  useEffect(() => {
    // Ya no necesitas llamar manualmente estas funciones
    // Los hooks ya se encargan de cargar los datos automáticamente
    const chatId = localStorage.getItem("chatId");
    //console.log("🚀 ~ StyledCardsPage ~ chatId:", chatId);

    setEstadoControlPaso1("Realizar");

    setChatidLoc(chatId || "");
    setPaso2RealizadosPorcentaje(0);
    verificarInicio();
  }, []); // Array vacío para ejecutar solo al montar

  useEffect(() => {
    reloadContarFilas();
  }, [chatidLoc]);

  useEffect(() => {
    if (contarFilas > 0) setFilasContar(contarFilas);
  }, [contarFilas]);

  useEffect(() => {
    console.log("🚀 ~ Paso2Realizados ~ useEffect");
    Paso2Realizados(paso2Realizados);
  }, [paso2Realizados]);

  const verificarInicio = () => {
    const dniDuplicados = localStorage.getItem("dniDuplicados");
    if (dniDuplicados === "Completado") {
      setEstado1(dniDuplicados);
      setRespuesta1("Sin Dni Duplicados");
    }

    const dniVacios = localStorage.getItem("dniVacios");
    if (dniVacios === "Completado") {
      setEstadoVacio(dniVacios);
      setRespuestaVacios("Sin Dni Vacios");
    }

    const paso1 = localStorage.getItem("paso1");
    if (paso1 === "Completado") {
      setEstadoPaso1(paso1);
      setRespuestaPaso1("Ejecutado correctamente");
    }

    const controlPaso1 = localStorage.getItem("controlPaso1");
    if (controlPaso1 === "Completado") {
      setEstadoControlPaso1(controlPaso1);
      setRespuestaControlPaso1(
        JSON.parse(localStorage.getItem("respuestaControlPaso1") || "")
      );
      setAfiliadosBajaControlPaso1(
        parseInt(localStorage.getItem("afiliadosBajaControlPaso1") || "0")
      );
    }

    const paso2 = localStorage.getItem("paso222");
    if (paso2 === "Completado") {
      setEstadoPaso2(paso2);
    }
    if (paso2 === "Iniciado") {
      setPaso2Realizados(1);
      setPaso2Loading(true);
    }

    const controlPaso2 = localStorage.getItem("controlPaso2");
    if (controlPaso2 === "Completado") {
      setEstadoControlPaso2(controlPaso2);
      setRespuestaControlPaso2(
        JSON.parse(localStorage.getItem("respuestaControlPaso2") || "")
      );
    }
  };
  const Paso2Realizados = async (item: number) => {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const cuenta = await contarPaso2Realizados(chatidLoc);
    console.log("🚀 ~ Paso2Realizados ~ cuenta:", cuenta);
    setPaso2Realizados(cuenta);
    const porcentaje = (cuenta * 100) / filasContar;
    const porcentajeInt = Math.round(porcentaje)
    if (porcentajeInt >= 0 ) {
      if (porcentajeInt <= 110 ) {
        setPaso2RealizadosPorcentaje(Math.round(porcentaje));
      }
    }
    
    if (Math.round(porcentaje) > 95) {
      setRespuestaPaso2("Ejecutado correctamente");
      setEstadoPaso2("Completado");
      localStorage.setItem("paso222", "Completado");
    }
  };

  const onTraerDniDuplicados = async () => {
    setTraerDniDuplicadosLoading(true);
    if (textBtnEstado1 === "Controlar") {
      const dniDuplicados = await traerDniDuplicados(chatidLoc);
      console.log("🚀 ~ onTraerDniDuplicados ~ dniDuplicados:", dniDuplicados);
      if (dniDuplicados.length === 0) {
        setRespuesta1("Sin Dni Duplicados");
        setEstado1("Completado");
        localStorage.setItem("dniDuplicados", "Completado");
      } else {
        setRespuesta1(`${dniDuplicados.length} Dni Duplicados`);
        setEstado1("En desarrollo");
        setTextBtnEstado1("Corregir");
      }
    }

    if (textBtnEstado1 === "Corregir") {
      const userConfirmed = confirm(
        "Esta accion borrara los registros duplicados dejando el mas reciente \nEsta seguro de continuar?"
      );

      if (userConfirmed) {
        const dniDuplicados = await traerDniDuplicados(chatidLoc);
        if (dniDuplicados.length > 0) {
          await saveLogsAcciones({
            idUsuario: 1,
            accion: "borrarDniDuplicados",
            informacion: JSON.stringify(dniDuplicados),
          });
        }
        await borrarDniDuplicados(chatidLoc);
        alert("Se borraron dni duplicados \nvolver a controlar");
        setRespuesta1("");
        setEstado1("Realizar");
        setTextBtnEstado1("Controlar");
      }
    }
    setTraerDniDuplicadosLoading(false);
    reloadContarFilas();
  };

  const onDniDuplicadosExportar = async () => {
    const list = await traerDniDuplicadosExportar(chatidLoc);
    console.log("🚀 ~ onDniDuplicadosExportar ~ list:", list);
    exportToExcel(list, "dniDuplicadosExportar");
  };
  const exportToExcel = (data: any[], fileName: string) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, `${fileName}.xlsx`);
  };

  const onDniVacios = async () => {
    setTraerDniVaciosLoading(true);
    if (textBtnEstadoVacio === "Controlar") {
      const dniVacios = await traerDniVacios(chatidLoc);
      console.log("🚀 ~ onDniVacios ~ dniVacios:", dniVacios);
      if (dniVacios.length === 0) {
        setRespuestaVacios("Sin Dni Vacios");
        setEstadoVacio("Completado");
        localStorage.setItem("dniVacios", "Completado");
      } else {
        setRespuestaVacios(`${dniVacios.length} Dni Vacios`);
        setEstadoVacio("En desarrollo");
        setTextBtnEstadoVacio("Corregir");
        setDniVacios(dniVacios);
      }
    }

    if (textBtnEstadoVacio === "Corregir") {
      const userConfirmed = confirm(
        "Esta accion borrara los registros con dni vacio \nEsta seguro de continuar?"
      );

      if (userConfirmed) {
        const dniVacios = await traerDniVacios(chatidLoc);
        if (dniVacios.length > 0) {
          await saveLogsAcciones({
            idUsuario: 1,
            accion: "borrarDniVacios",
            informacion: JSON.stringify(dniVacios),
          });
        }

        await borrarDniVacios(chatidLoc);
        alert("Se borraron dni vacios \nvolver a controlar");
        setRespuestaVacios("");
        setEstadoVacio("Realizar");
        setTextBtnEstadoVacio("Controlar");
      }
    }
    setTraerDniVaciosLoading(false);
    reloadContarFilas();
  };

  const onDniVaciosExportar = async () => {
    if (dniVacios.length > 0) {
      console.log("🚀 ~ onDniVaciosExportar ~ list:", dniVacios);
      exportToExcel(dniVacios, "dniVaciosExportar");
    } else {
      alert("No hay datos para exportar");
    }
  };

  const onPaso1 = async () => {
    setPaso1Loading(true);

    if (textBtnEstadoPaso1 === "Ejecutar") {
      const paso1 = await ejecutarPaso1(chatidLoc);

      if (paso1) {
        setRespuestaPaso1("Ejecutado correctamente");
        setEstadoPaso1("Completado");
        localStorage.setItem("paso1", "Completado");
        console.log("paso1");
      } else {
        setRespuestaPaso1(`Fallo ejecucion`);
        setEstadoPaso1("Error");
      }
    }

    setPaso1Loading(false);
    reloadContarFilas();
  };

  const onControlPaso1 = async () => {
    setControlPaso1Loading(true);

    if (textBtnControlPaso1 === "Ejecutar") {
      try {
        const respControlPaso1 = await controlPaso1(chatidLoc);

        setRespuestaControlPaso1(respControlPaso1.respuesta);
        setAfiliadosBajaControlPaso1(respControlPaso1.afiliadosBaja);
        //if (respControlPaso1.correcto){
        setEstadoControlPaso1("Completado");
        localStorage.setItem("controlPaso1", "Completado");
        localStorage.setItem(
          "respuestaControlPaso1",
          JSON.stringify(respControlPaso1.respuesta)
        );
        localStorage.setItem(
          "afiliadosBajaControlPaso1",
          respControlPaso1.afiliadosBaja.toString()
        );
        //} else {
        //setEstadoControlPaso1("Error");
        //}
      } catch (error) {
        setRespuestaControlPaso1(`Fallo ejecucion`);
        setAfiliadosBajaControlPaso1(0);
        setEstadoControlPaso1("Error");
      }
    }

    setControlPaso1Loading(false);
    reloadContarFilas();
  };

  const onPaso2 = async () => {
    setPaso2Loading(true);

    if (textBtnEstadoPaso2 === "Ejecutar") {
      setPaso2Realizados(1);
      localStorage.setItem("paso222", "Iniciado");
      const paso2 = await ejecutarPaso2(chatidLoc);
      console.log("🚀 ~ onPaso2 ~ paso2:", paso2);

      if (paso2) {
        setRespuestaPaso2("Ejecutado correctamente");
        setEstadoPaso2("Completado");
        localStorage.setItem("paso222", "Completado");
      } else {
        setRespuestaPaso2(`Fallo ejecucion`);
        setEstadoPaso2("Error");
      }
    }

    setPaso2Loading(false);
    //reloadContarFilas();
  };

  const onControlPaso2 = async () => {
    setControlPaso2Loading(true);

    if (textBtnControlPaso2 === "Ejecutar") {
      try {
        const respControlPaso2 = await controlPaso2(chatidLoc);
        console.log(
          "🚀 ~ onControlPaso2 ~ respControlPaso2:",
          respControlPaso2
        );

        setRespuestaControlPaso2(respControlPaso2.respuesta);

        //if (respControlPaso2.correcto){
        setEstadoControlPaso2("Completado");
        localStorage.setItem("controlPaso2", "Completado");
        localStorage.setItem(
          "respuestaControlPaso2",
          JSON.stringify(respControlPaso2.respuesta)
        );

        //} else {
        //setEstadoControlPaso2("Error");
        //}
      } catch (error) {
        setRespuestaControlPaso2(`Fallo ejecucion`);

        setEstadoControlPaso2("Error");
      }
    }

    setControlPaso2Loading(false);
    reloadContarFilas();
  };

  const handleClick = async () => {
    console.log("Botón clickeado");
    console.log("🚀 ~ handleClick ~ chatidLoc:", chatidLoc);

    localStorage.removeItem("dniDuplicados");
    localStorage.removeItem("dniVacios");
    localStorage.removeItem("paso1");
    localStorage.removeItem("controlPaso1");
    localStorage.removeItem("paso2");
    localStorage.removeItem("paso222");
    localStorage.removeItem("controlPaso2");
    await borrarDatosImportacion(chatidLoc);

    navigate("/panel");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Control de importación
            </h1>
            <div className="flex-1 flex justify-start">
              <button
                type="button"
                onClick={handleClick}
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                {"< Finalizar importación"}
              </button>
            </div>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Controles para verificar
            </p>
            <br />

            {contarFilasLoading ? (
              <div className="max-w-3xl mx-auto">
                <div className="w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                {`${filasContar} registros`}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Cards Section DNI Duplicados */}
          <div
            key={1}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {"DNI Duplicados"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {
                      "Trae los registros que tienen duplicado el dni, al corregir se borrara los registros para que solo quede un registro por dni"
                    }
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      estado1 === "Completado"
                        ? "bg-green-100 text-green-800"
                        : estado1 === "En desarrollo"
                        ? "bg-blue-100 text-blue-800"
                        : estado1 === "Realizar"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {estado1}
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {respuesta1}
                  </h3>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onDniDuplicadosExportar}
                  disabled={estado1 !== "En desarrollo"}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Exportar
                </button>
                <button
                  onClick={onTraerDniDuplicados}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={
                    traerDniDuplicadosLoading || estado1 === "Completado"
                  }
                >
                  {traerDniDuplicadosLoading
                    ? "Verificando..."
                    : textBtnEstado1}
                </button>
              </div>
            </div>
          </div>
          {/* Cards Section DNI Vacios */}
          <div
            key={2}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
              estado1 === "Completado"
                ? "opacity-100"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <div className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {"DNI Vacios"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {
                      "Trae los registros que no tienen dni o lo tienen en 0. Al corregir elimina los registros"
                    }
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      estadoVacio === "Completado"
                        ? "bg-green-100 text-green-800"
                        : estadoVacio === "En desarrollo"
                        ? "bg-blue-100 text-blue-800"
                        : estadoVacio === "Realizar"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {estadoVacio}
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {respuestaVacios}
                  </h3>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onDniVaciosExportar}
                  disabled={estadoVacio !== "En desarrollo"}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  Exportar
                </button>
                <button
                  onClick={onDniVacios}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={
                    traerDniVaciosLoading || estadoVacio === "Completado"
                  }
                >
                  {traerDniVaciosLoading
                    ? "Verificando..."
                    : textBtnEstadoVacio}
                </button>
              </div>
            </div>
          </div>

          {/* Cards Paso 1 */}
          <div
            key={2}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
              estadoVacio === "Completado"
                ? "opacity-100"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <div className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {"Paso 1"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {
                      "Al ejecutar este paso se graba la informacion en Temp_Padron_General y completar informacion desde otras tablas"
                    }
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      estadoPaso1 === "Completado"
                        ? "bg-green-100 text-green-800"
                        : estadoPaso1 === "Error"
                        ? "bg-red-100 text-red-800"
                        : estadoPaso1 === "Realizar"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {estadoPaso1}
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {respuestaPaso1}
                  </h3>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onPaso1}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={paso1Loading || estadoPaso1 === "Completado"}
                >
                  {paso1Loading ? "Verificando..." : textBtnEstadoPaso1}
                </button>
              </div>
            </div>
          </div>

          {/* Cards Control Paso 1 */}
          <div
            key={2}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
              estadoPaso1 === "Completado"
                ? "opacity-100"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <div className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {"Control del Paso 1"}
                  </h3>
                  {/*  <p className="text-sm text-gray-600 leading-relaxed">
                    {"Subtitulo"}
                  </p> */}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      estadoControlPaso1 === "Completado"
                        ? "bg-green-100 text-green-800"
                        : estadoControlPaso1 === "Error"
                        ? "bg-red-100 text-red-800"
                        : estadoControlPaso1 === "Realizar"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {estadoControlPaso1}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 mb-2 whitespace-pre-line">
                    {respuestaControlPaso1}
                  </p>
                  {respuestaControlPaso1.length > 0 && (
                    <p
                      className={`text-base font-semibold ${getColorTailwind(
                        afiliadosBajaControlPaso1,
                        100,
                        200
                      )} mb-2 whitespace-pre-line`}
                    >
                      {`afiliados_de_baja = ${afiliadosBajaControlPaso1}`}
                    </p>
                  )}
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onControlPaso1}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={
                    controlPaso1Loading || estadoControlPaso1 === "Completado"
                  }
                >
                  {controlPaso1Loading ? "Verificando..." : textBtnControlPaso1}
                </button>
              </div>
            </div>
          </div>

          {/* Cards Paso 2 */}
          <div
            key={2}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
              estadoControlPaso1 === "Completado"
                ? "opacity-100"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <div className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {"Paso 2"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {
                      "Al ejecutar este paso se graba la informacion en Temp_Padron_General y completar informacion desde otras tablas"
                    }
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      estadoPaso2 === "Completado"
                        ? "bg-green-100 text-green-800"
                        : estadoPaso2 === "Error"
                        ? "bg-red-100 text-red-800"
                        : estadoPaso2 === "Realizar"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {estadoPaso2}
                  </span>
                </div>
                <div className="flex-1 text-center">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {respuestaPaso2}
                  </h3>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onPaso2}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={paso2Loading || estadoPaso2 === "Completado"}
                >
                  {paso2Loading
                    ? `Procesando ${paso2RealizadosPorcentaje}%`
                    : textBtnEstadoPaso2}
                </button>
              </div>
            </div>
          </div>

          {/* Cards Control Paso 2 */}
          <div
            key={2}
            className={`bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 ${
              estadoPaso2 === "Completado"
                ? "opacity-100"
                : "opacity-50 pointer-events-none"
            }`}
          >
            <div className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {"Control del Paso 2"}
                  </h3>
                  {/*  <p className="text-sm text-gray-600 leading-relaxed">
                    {"Subtitulo"}
                  </p> */}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between mb-4">
                <div className="mb-6">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      estadoControlPaso2 === "Completado"
                        ? "bg-green-100 text-green-800"
                        : estadoControlPaso2 === "Error"
                        ? "bg-red-100 text-red-800"
                        : estadoControlPaso2 === "Realizar"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {estadoControlPaso2}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-base font-semibold text-gray-900 mb-2 whitespace-pre-line">
                    {respuestaControlPaso2}
                  </p>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  onClick={onControlPaso2}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  disabled={
                    controlPaso2Loading || estadoControlPaso2 === "Completado"
                  }
                >
                  {controlPaso2Loading ? "Verificando..." : textBtnControlPaso2}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Empty State for demonstration */}
        {/* <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              ¿Listo para crear un nuevo proyecto?
            </h3>
            <p className="text-gray-600 mb-6">
              Comienza tu próximo proyecto con nuestras herramientas avanzadas
            </p>
            <div className="flex gap-3 justify-center">
              <button className="px-6 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Explorar Plantillas
              </button>
              <button className="px-6 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                Crear Proyecto
              </button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default StyledCardsPage;
