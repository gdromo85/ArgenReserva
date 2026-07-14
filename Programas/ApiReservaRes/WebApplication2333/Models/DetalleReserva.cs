using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiReservaRes.Models
{
    public class DetalleReserva
    {
        public int detalleReservaId { get; set; }

        public int reservaId { get; set; }

        public UnidadAlojamiento unidadAlojamiento { get; set; }
        public decimal precioACobrar { get; set; }
        public int cantidadPersonas { get; set; }

        public DateTime fechaDesde { get; set; }
        public DateTime fechaHasta { get; set; }
    }
}