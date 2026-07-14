using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Web;
using ApiReservaRes.Heplers;
using ApiReservaRes.Models;

namespace ApiReservaRes.Data
{
    public class UnidadAlojamientoDAL
    {
        public static List<UnidadAlojamiento> traerUnidadesAlojamiento(int complejoId)
        {
            //string respuesta = string.Empty;
            var listObjeto = new List<UnidadAlojamiento>();


            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spUnidadAlojamientoSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                
               

                if (complejoId > 0)
                {
                    cmd.Parameters.AddWithValue("@ComplejoID", complejoId);
                }


                cmd.Connection = oConexion;
                try
                {
                    oConexion.Open();
                    //cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            UnidadAlojamiento objeto = new UnidadAlojamiento();
                            objeto.unidadAlojamientoId = Convert.ToInt32(dr["unidadAlojamientoId"]);
                            objeto.complejoId = Convert.ToInt32(dr["ComplejoId"]);
                            if (dr["Nombre"] != DBNull.Value) objeto.nombre = dr["Nombre"].ToString();
                            objeto.capacidad = Convert.ToInt32(dr["Capacidad"]);
                            if (dr["Descripcion"] != DBNull.Value) objeto.descripcion = dr["Descripcion"].ToString();
                            if (dr["Precio"] != DBNull.Value) objeto.precio = Convert.ToDecimal(dr["Precio"]);


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
        public static UnidadAlojamiento traerUnidadAlojamiento(int unidadAlojamientoId)
        {
            //string respuesta = string.Empty;
            var objeto = new UnidadAlojamiento();


            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spUnidadAlojamientoSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@UnidadAlojamientoID", unidadAlojamientoId));
                cmd.Connection = oConexion;
                try
                {
                    oConexion.Open();
                    //cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {

                           
                            objeto.unidadAlojamientoId = Convert.ToInt32(dr["unidadAlojamientoId"]);
                            objeto.complejoId = Convert.ToInt32(dr["ComplejoId"]);
                            if (dr["Nombre"] != DBNull.Value) objeto.nombre = dr["Nombre"].ToString();
                            objeto.capacidad = Convert.ToInt32(dr["Capacidad"]);
                            if (dr["Descripcion"] != DBNull.Value) objeto.descripcion = dr["Descripcion"].ToString();
                            if (dr["Precio"] != DBNull.Value) objeto.precio = Convert.ToDecimal(dr["Precio"]);


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

        public static UnidadAlojamiento agregarUnidadAlojamiento(UnidadAlojamiento objeto)
        {

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                //   @Telefono Varchar(160),
                //@Mensaje nvarchar(3000),
                //@ChatwootInbox Varchar(160)
                SqlCommand cmd = new SqlCommand("spUnidadAlojamientoIns", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@ComplejoId", objeto.complejoId));
                cmd.Parameters.Add(new SqlParameter("@Nombre", objeto.nombre));
                cmd.Parameters.Add(new SqlParameter("@Capacidad", objeto.capacidad));
                if (objeto.descripcion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", objeto.descripcion));
                }
                if (objeto.precio > 0)
                {
                    cmd.Parameters.Add(new SqlParameter("@Precio", objeto.precio));
                }
               
                cmd.Connection = oConexion;



                try
                {
                    oConexion.Open();

                    int unidadAlojamientoId = Convert.ToInt32(cmd.ExecuteScalar());
                    return traerUnidadAlojamiento(unidadAlojamientoId);


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

        public static UnidadAlojamiento editarUnidadAlojamiento(UnidadAlojamiento objeto)
        {

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                //   @Telefono Varchar(160),
                //@Mensaje nvarchar(3000),
                //@ChatwootInbox Varchar(160)
                SqlCommand cmd = new SqlCommand("spUnidadAlojamientoUpd", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@UnidadAlojamientoId", objeto.unidadAlojamientoId));
                cmd.Parameters.Add(new SqlParameter("@ComplejoID", objeto.complejoId));
                cmd.Parameters.Add(new SqlParameter("@Nombre", objeto.nombre));
              
                if (objeto.capacidad > 0)
                {
                    cmd.Parameters.Add(new SqlParameter("@Capacidad", objeto.capacidad));
                }
                if (objeto.descripcion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", objeto.descripcion));
                }
                if (objeto.precio > 0)
                {
                    cmd.Parameters.Add(new SqlParameter("@Precio", objeto.precio));
                }

                cmd.Connection = oConexion;

                try
                {
                    oConexion.Open();
                    cmd.ExecuteNonQuery();
                    return traerUnidadAlojamiento(objeto.unidadAlojamientoId);

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

        public static Boolean eliminarUnidadAlojamiento(int unidadAlojamientoId)
        {
            //string respuesta = string.Empty;



            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spUnidadAlojamientoDel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                ;
                if (unidadAlojamientoId > 0)
                {
                    cmd.Parameters.AddWithValue("@UnidadAlojamientoId", unidadAlojamientoId);
                }


                cmd.Connection = oConexion;
                try
                {
                    oConexion.Open();
                    //cmd.ExecuteNonQuery();


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
    }
}