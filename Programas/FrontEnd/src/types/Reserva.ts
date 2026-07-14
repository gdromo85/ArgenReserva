import { DetalleReserva } from "./DetalleReserva";
import { Inquilino } from "./Inquilino";
import { TipoReserva } from "./TipoReserva";

export interface Reserva {
  reservaId?: number;
  detalleReserva: DetalleReserva[];
  inquilino: Inquilino;
  tipoReserva: TipoReserva;
  seña: number;
  TotalAPagar: number;
  TotalPagado: number;
}
