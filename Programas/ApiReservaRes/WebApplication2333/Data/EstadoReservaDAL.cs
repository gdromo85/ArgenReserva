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
    public class EstadoReservaDAL
    {

        public static List<EstadoReserva> TraerEstados()
        {
            //string respuesta = string.Empty;
            var listObjeto = new List<EstadoReserva>();


            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spEstadoReservaSel", oConexion);
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
                            EstadoReserva objeto = new EstadoReserva();
                            objeto.estadoReservaId = Convert.ToInt32(dr["EstadoReservaId"]);
                            if (dr["Nombre"] != DBNull.Value) objeto.nombre = dr["Nombre"].ToString();
                            if (dr["Descripcion"] != DBNull.Value) objeto.descripcion = dr["Descripcion"].ToString();
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