using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using System.Web;
using ApiReservaRes.Heplers;
using ApiReservaRes.Models;

namespace ApiReservaRes.Data
{
    public class ComplejoDAL
    {

        public static List<Complejos> TraerListadoComplejo()
        {
            //string respuesta = string.Empty;
            var listObjeto = new List<Complejos>();


            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spComplejoSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
               ;          
                //cmd.Parameters.AddWithValue("@Cliente", datos.cliente);

                cmd.Connection = oConexion;
                try
                {
                    oConexion.Open();
                    //cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            Complejos objeto = new Complejos();
                            objeto.ComplejoID = Convert.ToInt32(dr["ComplejoID"]);
                            if (dr["Nombre"] != DBNull.Value) objeto.Nombre = dr["Nombre"].ToString();
                            listObjeto.Add(objeto);

                        }

                    }
                    return listObjeto;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    Console.WriteLine("Error");
                    throw ex;
                }
                finally
                {
                    oConexion.Close();
                }
            }


        }
    }
}