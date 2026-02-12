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
    public class UsuarioDAL
    {

        public static List<Usuario> TraerListadoUsuario(int usuarioId)
        {
            //string respuesta = string.Empty;
            var listObjeto = new List<Usuario>();


            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spUsuarioSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                ;
                if (usuarioId > 0)
                {
                    cmd.Parameters.AddWithValue("@UsuarioID", usuarioId);
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
                            Usuario objeto = new Usuario();
                            objeto.usuarioID = Convert.ToInt32(dr["UsuarioID"]);
                            if (dr["Nombre"] != DBNull.Value) objeto.nombre = dr["Nombre"].ToString();
                            if (dr["Email"] != DBNull.Value) objeto.email = dr["Email"].ToString();
                            if (dr["PasswordHash"] != DBNull.Value) objeto.passwordHash = dr["PasswordHash"].ToString();
                            objeto.activo = Convert.ToBoolean(dr["Activo"]);

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

        public static Usuario validarUsuario(String nombreUsuario, String contrasena)
        {

            Usuario objeto = new Usuario();

            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spUsuarioPassSel", oConexion);
                cmd.CommandType = CommandType.StoredProcedure;
                ;
                if (nombreUsuario != null)
                {
                    cmd.Parameters.AddWithValue("@Nombre", nombreUsuario);
                }
                if (contrasena != null)
                {
                    cmd.Parameters.AddWithValue("@PasswordHash", contrasena);
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
                            ;
                            objeto.usuarioID = Convert.ToInt32(dr["UsuarioID"]);
                            if (dr["Nombre"] != DBNull.Value) objeto.nombre = dr["Nombre"].ToString();
                            if (dr["Email"] != DBNull.Value) objeto.email = dr["Email"].ToString();
                            if (dr["PasswordHash"] != DBNull.Value) objeto.passwordHash = dr["PasswordHash"].ToString();
                            objeto.activo = Convert.ToBoolean(dr["Activo"]);


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
    }
}