import { UnidadAlojamiento } from "./UnidadAlojamiento";

export interface DetalleReserva {
  detalleReservaId?: number;
  reservaId?: number;
  unidadAlojamiento: UnidadAlojamiento;
  precioACobrar: number;
  cantidadPersonas: number;
  fechaDesde: string;
  fechaHasta: string;
}
