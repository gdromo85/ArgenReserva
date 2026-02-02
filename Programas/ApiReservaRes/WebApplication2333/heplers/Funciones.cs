using System.Data.SqlClient;
using System;

namespace ApiReservaRes.Heplers
{
    public class Funciones
    {
        public static string CalcularEdad(DateTime fechaNacimiento)
        {
            //Obtengo la diferencia en años.
            int edad = DateTime.Now.Year - fechaNacimiento.Year;
            String tipo = "Años";
            //Obtengo la fecha de cumpleaños de este año.
            DateTime nacimientoAhora = fechaNacimiento.AddYears(edad);
            //Le resto un año si la fecha actual es anterior
            //al día de nacimiento.
            if (DateTime.Now.CompareTo(nacimientoAhora) > 0)
            {
                edad--;
            }

            if (edad > 1) { 
                return edad.ToString() + " " + tipo; 
            } else
            {
                edad = DateTime.Now.Month - fechaNacimiento.Month;
                tipo = "Meses";
                if (edad > 1)
                {
                    return edad.ToString() + " " + tipo;
                } else
                {
                    edad = DateTime.Now.Day - fechaNacimiento.Day;
                    tipo = "Dias";
                    return edad.ToString() + " " + tipo;
                }
                    
            }
            
        }

    }
}