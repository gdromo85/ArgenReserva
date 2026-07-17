import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { useReservas } from "../context/ReservasContext";
import { Reserva } from "../types/Reserva";
import { calcularNoches } from "./DetalleReservaRow";

const formatMoneda = (valor: number): string =>
  (valor || 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const formatFecha = (fechaISO: string): string => {
  const d = new Date(`${fechaISO.slice(0, 10)}T00:00:00`);
  if (isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" }).replace(/\./g, "");
};

interface ReservaConRango {
  reserva: Reserva;
  desde: string;
  hasta: string;
  unidades: string[];
  personas: number;
}

const hoyISO = (): string => new Date().toISOString().slice(0, 10);

const ProximasReservas: React.FC = () => {
  const { reservas, loading } = useReservas();

  const proximas = useMemo<ReservaConRango[]>(() => {
    const hoy = hoyISO();

    return reservas
      .map((reserva): ReservaConRango | null => {
        const detalles = reserva.detalleReserva || [];
        const fechasDesde = detalles.map(d => d.fechaDesde?.slice(0, 10)).filter(Boolean).sort();
        const fechasHasta = detalles.map(d => d.fechaHasta?.slice(0, 10)).filter(Boolean).sort();
        if (fechasDesde.length === 0 || fechasHasta.length === 0) return null;

        const unidades = Array.from(
          new Map(
            detalles
              .filter(d => d.unidadAlojamiento?.nombre)
              .map(d => [d.unidadAlojamiento!.unidadAlojamientoId ?? d.unidadAlojamiento!.nombre, d.unidadAlojamiento!.nombre])
          ).values()
        ) as string[];

        return {
          reserva,
          desde: fechasDesde[0],
          hasta: fechasHasta[fechasHasta.length - 1],
          unidades,
          personas: detalles.reduce((sum, d) => sum + (d.cantidadPersonas || 0), 0)
        };
      })
      .filter((x): x is ReservaConRango => x !== null && x.desde >= hoy)
      .sort((a, b) => a.desde.localeCompare(b.desde))
      .slice(0, 5);
  }, [reservas]);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center p-6 pb-4">
        <h2 className="text-xl font-semibold">Próximas Reservas</h2>
        <Link
          to="/panel/reservas"
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          Ver todas →
        </Link>
      </div>

      {loading && proximas.length === 0 ? (
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : proximas.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No hay próximas reservas</p>
      ) : (
        <div className="divide-y divide-gray-100 border-t border-gray-100">
          {proximas.map(({ reserva, desde, hasta, unidades, personas }) => {
            const debe = (reserva.TotalAPagar ?? 0) - (reserva.TotalPagado ?? 0);
            const noches = calcularNoches(desde, hasta);

            return (
              <div key={reserva.reservaId} className="flex flex-col sm:flex-row sm:items-start gap-3 px-6 py-4">
                <div className="sm:w-64 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <svg viewBox="0 0 3 2" className="h-3 w-[1.125rem] shrink-0 rounded-sm" aria-hidden="true">
                      <rect width="3" height="2" fill="#74ACDF" />
                      <rect width="3" height="0.667" y="0.667" fill="#FFFFFF" />
                    </svg>
                    <span className="font-semibold text-gray-900">
                      {reserva.inquilino?.nombre} {reserva.inquilino?.apellido}
                    </span>
                  </div>
                  {reserva.inquilino?.telefono && (
                    <p className="text-sm text-indigo-600">{reserva.inquilino.telefono}</p>
                  )}
                  {unidades.map(nombre => (
                    <p key={nombre} className="text-sm text-gray-500">{nombre}</p>
                  ))}
                </div>

                <div className="flex-1">
                  <p className="font-mono text-sm text-gray-700">
                    {formatFecha(desde)} – {formatFecha(hasta)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {noches} {noches === 1 ? "noche" : "noches"} · {personas} {personas === 1 ? "persona" : "personas"}
                  </p>
                </div>

                <div className="sm:text-right sm:w-40 shrink-0">
                  <p className="font-mono font-semibold text-gray-900">{formatMoneda(reserva.TotalAPagar)}</p>
                  <p className={`text-sm ${debe > 0 ? "text-amber-700" : "text-green-700"}`}>
                    {debe > 0 ? `Debe ${formatMoneda(debe)}` : "Pagado"}
                  </p>
                  {reserva.FechaRegistro && (
                    <p className="text-xs text-gray-400">Reservado el {formatFecha(reserva.FechaRegistro)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProximasReservas;
