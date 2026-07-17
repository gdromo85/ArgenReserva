import { useLocation, Link, Outlet, useNavigate } from "react-router";
import "../styles/colors.css";
import { useComplejos } from "../context/ComplejosContext";
import { useAuth } from "../context/AuthContext";
import BrandMark from "../components/BrandMark";
import ProximasReservas from "../components/ProximasReservas";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { to: "/panel", label: "Inicio" },
  { to: "/panel/complejos", label: "Complejos" },
  { to: "/panel/reservas", label: "Reservas" }
];

function Panel() {
  const location = useLocation();
  const navigate = useNavigate();
  const { usuario, logout } = useAuth();
  const { complejosXUsuario, fetchComplejosXUsuario } = useComplejos();
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
      fetchComplejosXUsuario(usuario?.usuarioID || 0);
    }, []);

  useEffect(() => {
    setMenuAbierto(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const desktopLinkClass = (path: string): string =>
    `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      location.pathname === path
        ? "bg-indigo-700 text-white"
        : "text-indigo-100 hover:bg-indigo-500"
    }`;

  const mobileLinkClass = (path: string): string =>
    `block px-3 py-2 rounded-md text-base font-medium transition-colors ${
      location.pathname === path
        ? "bg-indigo-700 text-white"
        : "text-indigo-100 hover:bg-indigo-500"
    }`;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Menú Superior */}
      <nav className="bg-indigo-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo/Título */}
            <Link to="/panel" className="flex items-center gap-2 text-white font-bold text-xl">
              <BrandMark tone="light" className="h-6 w-auto" />
              ArgenReservas
            </Link>

            {/* Navegación (desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to} className={desktopLinkClass(link.to)}>
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Usuario y Logout (desktop) */}
            <div className="hidden md:flex items-center space-x-4">
              {usuario && (
                <span className="text-indigo-100 text-sm">
                  {usuario.nombre}
                </span>
              )}
              <button
                onClick={handleLogout}
                className="text-indigo-100 hover:text-white text-sm font-medium"
              >
                Cerrar Sesión
              </button>
            </div>

            {/* Botón hamburguesa (mobile) */}
            <button
              onClick={() => setMenuAbierto(v => !v)}
              className="md:hidden p-2 text-indigo-100 hover:text-white"
              aria-label={menuAbierto ? "Cerrar menú" : "Abrir menú"}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {menuAbierto ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Navegación (mobile) */}
          {menuAbierto && (
            <div className="md:hidden pb-4 space-y-1">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to} className={mobileLinkClass(link.to)}>
                  {link.label}
                </Link>
              ))}
              <div className="pt-2 mt-2 border-t border-indigo-500 flex items-center justify-between px-3">
                {usuario && (
                  <span className="text-indigo-100 text-sm">{usuario.nombre}</span>
                )}
                <button
                  onClick={handleLogout}
                  className="text-indigo-100 hover:text-white text-sm font-medium"
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Contenido Principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {location.pathname === "/panel" ? (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Bienvenido a ArgenReservas
              </h1>
              <p className="text-gray-600 text-center">
                Gestiona tus complejos y reservas de manera eficiente
              </p>
            </div>
            
            {usuario && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center font-mono text-lg font-semibold">
                    {usuario.nombre
                      .trim()
                      .split(/\s+/)
                      .slice(0, 2)
                      .map(parte => parte[0]?.toUpperCase())
                      .join("")}
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-semibold text-gray-900 truncate">{usuario.nombre}</p>
                    <p className="text-sm text-gray-500 truncate">{usuario.email}</p>
                  </div>
                  <span
                    className={`ml-0 sm:ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                      usuario.activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {usuario.activo ? "Activo" : "Inactivo"}
                  </span>
                  <span className="ml-auto font-mono text-xs text-gray-400">ID {usuario.usuarioID}</span>
                </div>
              </div>
            )}

            <div className="mb-8">
              <ProximasReservas />
            </div>

            {/* Complejos del Usuario */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Mis Complejos</h2>
                <Link
                  to="/panel/complejos"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                >
                  Ver todos →
                </Link>
              </div>
              
              {complejosXUsuario.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  No tienes complejos registrados
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {complejosXUsuario.slice(0, 3).map((complejo) => (
                    <div key={complejo.ComplejoID} className="border rounded-lg p-4">
                      <h3 className="font-semibold text-gray-900">{complejo.Nombre}</h3>
                      <p className="text-sm text-gray-600 mt-1">{complejo.Direccion}</p>
                      <p className="text-sm text-gray-600">{complejo.Telefono}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}

export default Panel;
