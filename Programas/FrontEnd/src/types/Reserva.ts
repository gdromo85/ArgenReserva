import { DetalleReserva } from "./DetalleReserva";
import { Inquilino } from "./Inquilino";
import { TipoReserva } from "./TipoReserva";
import { EstadoReserva } from "./EstadoReserva";

export interface Reserva {
  reservaId?: number;
  detalleReserva: DetalleReserva[];
  inquilino: Inquilino;
  tipoReserva: TipoReserva;
  estadoReserva: EstadoReserva;
  seña: number;
  TotalAPagar: number;
  TotalPagado: number;
}
