
using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication.Models
{
    public class BuzonDeEntrada
    {
        public string telefono { get; set; }
        public string idEntry { get; set; }
        public string waid { get; set; }
        public DateTimeOffset respuestaFecha { get; set; }
        public string mensajeRespuestaTexto { get; set; }
        public string jsonString { get; set; }
        public string contextId { get; set; }
    }

}

