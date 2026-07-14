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
    public class TipoReservaDAL
    {
        public static List<TipoReserva> TraerListadoTipoReserva()
        {
            var listObjeto = new List<TipoReserva>();

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spTipoReservaSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            listObjeto.Add(mapearTipoReserva(dr));
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

        public static TipoReserva traerTipoReserva(int tipoReservaId)
        {
            var objeto = new TipoReserva();

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spTipoReservaSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@TipoReservaID", tipoReservaId));
                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            objeto = mapearTipoReserva(dr);
                        }
                    }
                    return objeto;
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

        public static TipoReserva agregarTipoReserva(TipoReserva objeto)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spTipoReservaIns", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@nombre", objeto.nombre));

                if (objeto.descripcion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@descripcion", objeto.descripcion));
                }

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    int tipoReservaId = Convert.ToInt32(cmd.ExecuteScalar());
                    return traerTipoReserva(tipoReservaId);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    oConexion.Close();
                }
            }
        }

        public static TipoReserva editarTipoReserva(TipoReserva objeto)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spTipoReservaUpd", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@TipoReservaID", objeto.tipoReservaId));
                cmd.Parameters.Add(new SqlParameter("@nombre", objeto.nombre));

                if (objeto.descripcion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@descripcion", objeto.descripcion));
                }

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();
                    return traerTipoReserva(objeto.tipoReservaId);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    oConexion.Close();
                }
            }
        }

        public static Boolean eliminarTipoReserva(int tipoReservaId)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spTipoReservaDel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                if (tipoReservaId > 0)
                {
                    cmd.Parameters.AddWithValue("@TipoReservaID", tipoReservaId);
                }

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();
                    return true;
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

        // Helper interno para mapear la fila del reader a un objeto TipoReserva
        private static TipoReserva mapearTipoReserva(SqlDataReader dr)
        {
            TipoReserva objeto = new TipoReserva();
            objeto.tipoReservaId = Convert.ToInt32(dr["TipoReservaID"]);
            if (dr["nombre"] != DBNull.Value) objeto.nombre = dr["nombre"].ToString();
            if (dr["descripcion"] != DBNull.Value) objeto.descripcion = dr["descripcion"].ToString();
            return objeto;
        }
    }
}