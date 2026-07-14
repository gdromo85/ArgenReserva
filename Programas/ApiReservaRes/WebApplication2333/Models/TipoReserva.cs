using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiReservaRes.Models
{
    public class TipoReserva
    {
        public int tipoReservaId { get; set; }

        public string nombre { get; set; }
        public string descripcion { get; set; }
    }
}