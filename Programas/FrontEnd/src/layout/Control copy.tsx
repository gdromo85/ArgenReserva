import React, { useState } from "react";

const StyledCardsPage = () => {
  const cards = [
    {
      id: 1,
      title: "Proyecto Alpha",
      subtitle: "Sistema de gestión empresarial completo",
      status: "En desarrollo",
    },
    {
      id: 2,
      title: "Proyecto Beta",
      subtitle: "Plataforma de comercio electrónico",
      status: "Completado",
    },
    {
      id: 3,
      title: "Proyecto Gamma",
      subtitle: "Aplicación móvil para delivery",
      status: "En revisión",
    },
    {
      id: 4,
      title: "Proyecto Delta",
      subtitle: "Sistema de análisis de datos",
      status: "Planificado",
    },
    {
      id: 5,
      title: "Proyecto Epsilon",
      subtitle: "Portal de recursos humanos",
      status: "En desarrollo",
    },
    {
      id: 6,
      title: "Proyecto Zeta",
      subtitle: "Dashboard de métricas empresariales",
      status: "Completado",
    },
  ];
  const [estado1, setEstado1] = useState("Realizar");
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Control de importación
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Controles para verificar
            </p>
            <br />
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              12200 registros
            </p>
          </div>
        </div>
      </div>

      {/* Cards Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            key={1}
            className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {"Titulo"}
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {"Subtitulo"}
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
                    {"Resultado \n otro resultado y cosas oooo pp a pas "}
                  </h3>
                </div>
              </div>
              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Ver Detalles
                </button>
                <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  Editar
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
