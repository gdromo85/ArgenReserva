import React from "react";
import { Reserva } from "../types/Reserva";
import KeyTag from "./KeyTag";

interface ReservaCardProps {
  reserva: Reserva;
  onEdit: (reserva: Reserva) => void;
  onDelete: (reserva: Reserva) => void;
}

const formatMoneda = (valor: number): string =>
  (valor ?? 0).toLocaleString("es-AR", { style: "currency", currency: "ARS" });

const formatFecha = (fecha: string): string => {
  const d = new Date(fecha);
  return isNaN(d.getTime()) ? "-" : d.toLocaleDateString("es-AR");
};

const estadoBadgeClasses = (nombre?: string): string => {
  const key = nombre?.trim().toLowerCase() ?? "";
  if (key.includes("cancel") || key.includes("anulad")) return "bg-red-100 text-red-800";
  if (key.includes("confirm") || key.includes("pagad")) return "bg-green-100 text-green-800";
  if (key.includes("pendient")) return "bg-yellow-100 text-yellow-800";
  return "bg-gray-100 text-gray-800";
};

const ReservaCard: React.FC<ReservaCardProps> = ({ reserva, onEdit, onDelete }) => {
  const detalles = reserva.detalleReserva || [];
  const fechasDesde = detalles.map(d => d.fechaDesde).filter(Boolean).sort();
  const fechasHasta = detalles.map(d => d.fechaHasta).filter(Boolean).sort();
  const desde = fechasDesde[0];
  const hasta = fechasHasta[fechasHasta.length - 1];
  const unidadesUnicas = Array.from(
    new Map(
      detalles
        .filter(d => d.unidadAlojamiento?.nombre)
        .map(d => [d.unidadAlojamiento!.unidadAlojamientoId ?? d.unidadAlojamiento!.nombre, d.unidadAlojamiento!.nombre])
    ).values()
  );
  const debe = (reserva.TotalAPagar ?? 0) - (reserva.TotalPagado ?? 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {reserva.inquilino?.nombre} {reserva.inquilino?.apellido}
            </h3>
            {reserva.estadoReserva?.nombre && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${estadoBadgeClasses(reserva.estadoReserva.nombre)}`}>
                {reserva.estadoReserva.nombre}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500">{reserva.tipoReserva?.nombre}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(reserva)}
            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors"
            title="Editar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button
            onClick={() => onDelete(reserva)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
            title="Eliminar"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {desde && hasta && (
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="font-mono text-sm text-gray-600">{formatFecha(desde)} → {formatFecha(hasta)}</span>
          </div>
        )}

        <div className="flex items-start gap-2">
          <svg className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          {unidadesUnicas.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {unidadesUnicas.map(nombre => (
                <KeyTag key={nombre} label={nombre!} />
              ))}
            </div>
          ) : (
            <span className="text-gray-500">Sin unidades asignadas</span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
          </svg>
          <span className="font-mono text-sm text-gray-600">
            {formatMoneda(reserva.TotalAPagar)} · pagado {formatMoneda(reserva.TotalPagado)}
          </span>
        </div>

        <div className={`font-mono text-sm font-medium ${debe > 0 ? "text-amber-700" : "text-green-700"}`}>
          {debe > 0 ? `Debe ${formatMoneda(debe)}` : "Sin saldo pendiente"}
        </div>

        {reserva.descripcion && (
          <div className="flex items-start gap-2 pt-1">
            <svg className="h-5 w-5 text-gray-400 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-4 4v-4z" />
            </svg>
            <span className="text-sm text-gray-600 italic">{reserva.descripcion}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservaCard;
