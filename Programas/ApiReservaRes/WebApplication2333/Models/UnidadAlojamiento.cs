using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiReservaRes.Models
{
    public class UnidadAlojamiento
    {
        public int unidadAlojamientoId { get; set; }

        public int complejoId { get; set; }
        public string nombre { get; set; }
        public int capacidad { get; set; }
        public String descripcion { get; set; }
        public decimal precio { get; set; }

    }
}