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
    public class CabanaDAL
    {
        public static List<Cabana> TraerCabanas(int complejoId)
        {
            //string respuesta = string.Empty;
            var listObjeto = new List<Cabana>();


            using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
            {
                SqlCommand cmd = new SqlCommand("spCabanaSel", oConexion);
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

                    using (SqlDataReader dr = cmd.ExecuteReader())
                    {

                        while (dr.Read())
                        {
                            Cabana objeto = new Cabana();
                            objeto.cabanaId = Convert.ToInt32(dr["CabanaId"]);
                            if (dr["NombreCodigo"] != DBNull.Value) objeto.nombreCodigo = dr["NombreCodigo"].ToString();
                           
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
    }
}