using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiReservaRes.Models
{
    public class EstadoReserva
    {
        public int estadoReservaId { get; set; }

        public string nombre { get; set; }
        public string descripcion { get; set; }
       
    }
}