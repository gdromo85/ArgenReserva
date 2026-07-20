using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiReservaRes.Models
{
    public class Reserva
    {
        public int reservaId { get; set; }

        public List<DetalleReserva> detalleReserva { get; set; }


        public Inquilino inquilino { get; set; }
        public TipoReserva tipoReserva { get; set; }
        public EstadoReserva estadoReserva { get; set; }
        public decimal seña { get; set; }
        public decimal TotalAPagar { get; set; }
        public decimal TotalPagado { get; set; }
        public DateTime FechaRegistro { get; set; }

        public string descripcion { get; set; }


    }
}