using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiReservaRes.Models
{
    public class Cabana
    {
        public int cabanaId { get; set; }

        public Complejos complejo { get; set; }
        public string nombreCodigo { get; set; }
        public int capacidad { get; set; }
        public float precioBase { get; set; }
        public String imagenUrl { get; set; }
        public Boolean activo { get; set; }
    }
}