
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication.Models
{
    public class EstadoMensaje
    {
        public string telefono { get; set; }
        public string waid { get; set; }
        public string status { get; set; }
        public DateTimeOffset respuestaFecha { get; set; }
        public string error { get; set; }
    }

}

