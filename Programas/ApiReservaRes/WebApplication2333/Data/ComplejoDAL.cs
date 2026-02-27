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
                            if (dr["Direccion"] != DBNull.Value) objeto.Direccion = dr["Direccion"].ToString();
                            if (dr["Telefono"] != DBNull.Value) objeto.Telefono = dr["Telefono"].ToString();
                            if (dr["Descripcion"] != DBNull.Value) objeto.Descripcion = dr["Descripcion"].ToString();
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

        public static Complejos traerComplejo(int complejoId)
        {
            //string respuesta = string.Empty;
            var objeto = new Complejos();


            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spComplejoSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                
                cmd.Parameters.Add(new SqlParameter("@ComplejoID", complejoId));
                cmd.Connection = oConexion;
                try
                {
                    oConexion.Open();
                    //cmd.ExecuteNonQuery();

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            
                            objeto.ComplejoID = Convert.ToInt32(dr["ComplejoID"]);
                            if (dr["Nombre"] != DBNull.Value) objeto.Nombre = dr["Nombre"].ToString();
                            if (dr["Direccion"] != DBNull.Value) objeto.Direccion = dr["Direccion"].ToString();
                            if (dr["Telefono"] != DBNull.Value) objeto.Telefono = dr["Telefono"].ToString();
                            if (dr["Descripcion"] != DBNull.Value) objeto.Descripcion = dr["Descripcion"].ToString();
                            

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


        public static Complejos agregarComplejo(Complejos objeto)
        {

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                //   @Telefono Varchar(160),
                //@Mensaje nvarchar(3000),
                //@ChatwootInbox Varchar(160)
                SqlCommand cmd = new SqlCommand("spComplejoIns", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@Nombre", objeto.Nombre));            
                if (objeto.Direccion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@Direccion", objeto.Direccion));
                }
                if (objeto.Telefono != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@Telefono", objeto.Telefono));
                }
                if (objeto.Descripcion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", objeto.Descripcion));
                }

                cmd.Connection = oConexion;

               

                try
                {
                    oConexion.Open();
                   
                    int complejoId = Convert.ToInt32(cmd.ExecuteScalar());
                    return traerComplejo(complejoId);
                  

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

        public static bool editarComplejo(Complejos objeto)
        {

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                //   @Telefono Varchar(160),
                //@Mensaje nvarchar(3000),
                //@ChatwootInbox Varchar(160)
                SqlCommand cmd = new SqlCommand("spComplejoUpd", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.Add(new SqlParameter("@ComplejoID", objeto.ComplejoID));
                cmd.Parameters.Add(new SqlParameter("@Nombre", objeto.Nombre));
                if (objeto.Direccion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@Direccion", objeto.Direccion));
                }
                if (objeto.Telefono != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@Telefono", objeto.Telefono));
                }
                if (objeto.Descripcion != "")
                {
                    cmd.Parameters.Add(new SqlParameter("@Descripcion", objeto.Descripcion));
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

                    throw ex;
                }
                finally
                {
                    oConexion.Close();
                }
            }
        }

        public static Boolean eliminarComplejo(int complejoId)
        {
            //string respuesta = string.Empty;
          


            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spComplejoDel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                ;
                if (complejoId > 0)
                {
                    cmd.Parameters.AddWithValue("@ComplejoID", complejoId);
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