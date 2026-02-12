using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiReservaRes.Models
{
    public class Cliente
    {
        public int clienteId { get; set; }

        public string dni { get; set; }
        public string nombreCompleto { get; set; }
        public string telefono { get; set; }
        public string email { get; set; }
    }
}