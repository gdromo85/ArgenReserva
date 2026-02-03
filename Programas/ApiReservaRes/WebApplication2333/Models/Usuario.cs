using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ApiReservaRes.Models
{
    public class Usuario
    {
        public int usuarioID { get; set; }
        public String nombre { get; set; }
        public String email { get; set; }
        public String passwordHash { get; set; }    
        public Boolean activo { get; set; }
    }
}