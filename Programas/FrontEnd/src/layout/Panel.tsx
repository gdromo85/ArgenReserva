import "../styles/colors.css";

import { useLocation } from "react-router";

interface Usuario {
  usuarioID: number;
  nombre: string;
  email: string;
  activo: boolean;
  passwordHash: string;
}

function Panel() {
  const location = useLocation();
  const usuario = location.state?.usuario as Usuario | undefined;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
            Ventana de Reservas
          </h1>
          <p className="text-gray-600 text-center">
            Explicacion del funcionamiento
          </p>
        </div>
        
        {usuario && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Datos del Usuario</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">ID:</p>
                <p className="font-medium">{usuario.usuarioID}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nombre:</p>
                <p className="font-medium">{usuario.nombre}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email:</p>
                <p className="font-medium">{usuario.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Activo:</p>
                <p className="font-medium">{usuario.activo ? "Sí" : "No"}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Panel;
