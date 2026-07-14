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
    public class ReservaDAL
    {
        public static List<Reserva> TraerListadoReserva()
        {
            var listObjeto = new List<Reserva>();

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spReservaSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            var reserva = mapearReserva(dr);
                            listObjeto.Add(reserva);
                        }
                    }
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

            // Los detalles siguen aparte porque son una relación 1-a-muchos (no entra en un solo SELECT plano)
            foreach (var reserva in listObjeto)
            {
                reserva.detalleReserva = DetalleReservaDAL.traerDetallesPorReserva(reserva.reservaId);
            }

            return listObjeto;
        }

        public static Reserva traerReserva(int reservaId)
        {
            Reserva objeto = null;

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spReservaSel", oConexion);
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
                            objeto = mapearReserva(dr);
                        }
                    }
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

            if (objeto != null)
            {
                objeto.detalleReserva = DetalleReservaDAL.traerDetallesPorReserva(objeto.reservaId);
            }

            return objeto;
        }

        public static Reserva agregarReserva(Reserva objeto)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spReservaIns", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@InquilinoID", objeto.inquilino.inquilinoId));
                cmd.Parameters.Add(new SqlParameter("@TipoReservaID", objeto.tipoReserva.tipoReservaId));
                cmd.Parameters.Add(new SqlParameter("@Sena", objeto.seña));
                cmd.Parameters.Add(new SqlParameter("@TotalAPagar", objeto.TotalAPagar));
                cmd.Parameters.Add(new SqlParameter("@TotalPagado", objeto.TotalPagado));

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    int reservaId = Convert.ToInt32(cmd.ExecuteScalar());

                    // Insertar cada detalle asociado a la nueva reserva
                    if (objeto.detalleReserva != null)
                    {
                        foreach (var detalle in objeto.detalleReserva)
                        {
                            detalle.reservaId = reservaId;
                            DetalleReservaDAL.agregarDetalleReserva(detalle);
                        }
                    }

                    return traerReserva(reservaId);
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

        public static Reserva editarReserva(Reserva objeto)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spReservaUpd", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@ReservaID", objeto.reservaId));
                cmd.Parameters.Add(new SqlParameter("@InquilinoID", objeto.inquilino.inquilinoId));
                cmd.Parameters.Add(new SqlParameter("@TipoReservaID", objeto.tipoReserva.tipoReservaId));
                cmd.Parameters.Add(new SqlParameter("@Sena", objeto.seña));
                cmd.Parameters.Add(new SqlParameter("@TotalAPagar", objeto.TotalAPagar));
                cmd.Parameters.Add(new SqlParameter("@TotalPagado", objeto.TotalPagado));

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();
                    return traerReserva(objeto.reservaId);
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

        public static Boolean eliminarReserva(int reservaId)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spReservaDel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.AddWithValue("@ReservaID", reservaId);
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

        // Helper interno para mapear la fila del reader a un objeto Reserva parcial
        private static Reserva mapearReserva(SqlDataReader dr)
        {
            Reserva objeto = new Reserva();
            objeto.reservaId = Convert.ToInt32(dr["ReservaID"]);
            if (dr["Sena"] != DBNull.Value) objeto.seña = Convert.ToDecimal(dr["Sena"]);
            if (dr["TotalAPagar"] != DBNull.Value) objeto.TotalAPagar = Convert.ToDecimal(dr["TotalAPagar"]);
            if (dr["TotalPagado"] != DBNull.Value) objeto.TotalPagado = Convert.ToDecimal(dr["TotalPagado"]);

            var inquilino = new Inquilino();
            inquilino.inquilinoId = Convert.ToInt32(dr["InquilinoID"]);
            if (dr["Inquilino_Nombre"] != DBNull.Value) inquilino.nombre = dr["Inquilino_Nombre"].ToString();
            if (dr["Inquilino_Apellido"] != DBNull.Value) inquilino.apellido = dr["Inquilino_Apellido"].ToString();
            if (dr["Inquilino_Direccion"] != DBNull.Value) inquilino.direccion = dr["Inquilino_Direccion"].ToString();
            if (dr["Inquilino_Telefono"] != DBNull.Value) inquilino.telefono = dr["Inquilino_Telefono"].ToString();
            if (dr["Inquilino_Descripcion"] != DBNull.Value) inquilino.descripcion = dr["Inquilino_Descripcion"].ToString();
            objeto.inquilino = inquilino;

            var tipoReserva = new TipoReserva();
            tipoReserva.tipoReservaId = Convert.ToInt32(dr["TipoReservaID"]);
            if (dr["TipoReserva_Nombre"] != DBNull.Value) tipoReserva.nombre = dr["TipoReserva_Nombre"].ToString();
            if (dr["TipoReserva_Descripcion"] != DBNull.Value) tipoReserva.descripcion = dr["TipoReserva_Descripcion"].ToString();
            objeto.tipoReserva = tipoReserva;

            return objeto;
        }
    }
}