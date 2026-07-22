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
    public class DetalleReservaDAL
    {
        public static List<DetalleReserva> traerDetallesPorReserva(int reservaId)
        {
            var listObjeto = new List<DetalleReserva>();

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spDetalleReservaSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@ReservaID", reservaId));
                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            DetalleReserva objeto = new DetalleReserva();
                            objeto.detalleReservaId = Convert.ToInt32(dr["DetalleReservaID"]);
                            objeto.reservaId = Convert.ToInt32(dr["ReservaID"]);
                            if (dr["PrecioACobrar"] != DBNull.Value) objeto.precioACobrar = Convert.ToDecimal(dr["PrecioACobrar"]);
                            if (dr["CantidadPersonas"] != DBNull.Value) objeto.cantidadPersonas = Convert.ToInt32(dr["CantidadPersonas"]);
                            if (dr["FechaDesde"] != DBNull.Value) objeto.fechaDesde = Convert.ToDateTime(dr["FechaDesde"]);
                            if (dr["FechaHasta"] != DBNull.Value) objeto.fechaHasta = Convert.ToDateTime(dr["FechaHasta"]);

                            int unidadAlojamientoId = Convert.ToInt32(dr["UnidadAlojamientoID"]);
                            objeto.unidadAlojamiento = UnidadAlojamientoDAL.traerUnidadAlojamiento(unidadAlojamientoId);

                            listObjeto.Add(objeto);
                        }
                    }
                    return listObjeto;
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    throw ex;
                }
                finally
                {
                    oConexion.Close();
                }
            }
        }

        public static DetalleReserva agregarDetalleReserva(DetalleReserva objeto)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spDetalleReservaIns", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@ReservaID", objeto.reservaId));
                cmd.Parameters.Add(new SqlParameter("@UnidadAlojamientoID", objeto.unidadAlojamiento.unidadAlojamientoId));
                cmd.Parameters.Add(new SqlParameter("@PrecioACobrar", objeto.precioACobrar));
                cmd.Parameters.Add(new SqlParameter("@CantidadPersonas", objeto.cantidadPersonas));
                cmd.Parameters.Add(new SqlParameter("@FechaDesde", objeto.fechaDesde));
                cmd.Parameters.Add(new SqlParameter("@FechaHasta", objeto.fechaHasta));

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    int detalleReservaId = Convert.ToInt32(cmd.ExecuteScalar());
                    objeto.detalleReservaId = detalleReservaId;
                    return objeto;
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

        public static DetalleReserva editarDetalleReserva(DetalleReserva objeto)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spDetalleReservaUpd", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@DetalleReservaID", objeto.detalleReservaId));
                cmd.Parameters.Add(new SqlParameter("@UnidadAlojamientoID", objeto.unidadAlojamiento.unidadAlojamientoId));
                cmd.Parameters.Add(new SqlParameter("@PrecioACobrar", objeto.precioACobrar));
                cmd.Parameters.Add(new SqlParameter("@CantidadPersonas", objeto.cantidadPersonas));
                cmd.Parameters.Add(new SqlParameter("@FechaDesde", objeto.fechaDesde));
                cmd.Parameters.Add(new SqlParameter("@FechaHasta", objeto.fechaHasta));

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();
                    return objeto;
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

        public static Boolean eliminarDetalleReserva(int detalleReservaId)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spDetalleReservaDel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@DetalleReservaID", detalleReservaId);
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