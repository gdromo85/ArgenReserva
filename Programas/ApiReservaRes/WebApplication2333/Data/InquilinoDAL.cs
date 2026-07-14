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
    public class InquilinoDAL
    {
        public static List<Inquilino> TraerListadoInquilino()
        {
            var listObjeto = new List<Inquilino>();

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spInquilinoSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            listObjeto.Add(mapearInquilino(dr));
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

        public static Inquilino traerInquilino(int inquilinoId)
        {
            var objeto = new Inquilino();

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spInquilinoSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                cmd.Parameters.Add(new SqlParameter("@InquilinoID", inquilinoId));
                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {
                        while (dr.Read())
                        {
                            objeto = mapearInquilino(dr);
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

        public static Inquilino agregarInquilino(Inquilino objeto)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spInquilinoIns", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@nombre", objeto.nombre));
                cmd.Parameters.Add(new SqlParameter("@Apellido", objeto.apellido));

                if (objeto.direccion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@direccion", objeto.direccion));
                }
                if (objeto.telefono != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@telefono", objeto.telefono));
                }
                if (objeto.descripcion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@descripcion", objeto.descripcion));
                }

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    int inquilinoId = Convert.ToInt32(cmd.ExecuteScalar());
                    return traerInquilino(inquilinoId);
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

        public static Inquilino editarInquilino(Inquilino objeto)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spInquilinoUpd", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@InquilinoID", objeto.inquilinoId));
                cmd.Parameters.Add(new SqlParameter("@nombre", objeto.nombre));
                cmd.Parameters.Add(new SqlParameter("@Apellido", objeto.apellido));

                if (objeto.direccion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@direccion", objeto.direccion));
                }
                if (objeto.telefono != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@telefono", objeto.telefono));
                }
                if (objeto.descripcion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@descripcion", objeto.descripcion));
                }

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();
                    return traerInquilino(objeto.inquilinoId);
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

        public static Boolean eliminarInquilino(int inquilinoId)
        {
            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spInquilinoDel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                if (inquilinoId > 0)
                {
                    cmd.Parameters.AddWithValue("@InquilinoID", inquilinoId);
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

        // Helper interno para mapear la fila del reader a un objeto Inquilino
        private static Inquilino mapearInquilino(SqlDataReader dr)
        {
            Inquilino objeto = new Inquilino();
            objeto.inquilinoId = Convert.ToInt32(dr["InquilinoID"]);
            if (dr["nombre"] != DBNull.Value) objeto.nombre = dr["nombre"].ToString();
            if (dr["Apellido"] != DBNull.Value) objeto.apellido = dr["Apellido"].ToString();
            if (dr["direccion"] != DBNull.Value) objeto.direccion = dr["direccion"].ToString();
            if (dr["telefono"] != DBNull.Value) objeto.telefono = dr["telefono"].ToString();
            if (dr["descripcion"] != DBNull.Value) objeto.descripcion = dr["descripcion"].ToString();
            return objeto;
        }
    }
}