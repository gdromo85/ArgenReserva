using System;
using System.Configuration;

namespace ApiReservaRes.Heplers
{
    public class Conexion
    {
        private static string rutaConexion = ConfigurationManager.AppSettings["RutaConexion"];
        
        public static string obtenerRutaConexion()
        {
            string conexion;
            
            conexion = rutaConexion;
            
            return conexion;
        }


    }
}
