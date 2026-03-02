using Newtonsoft.Json;

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;

using ApiReservaRes.utils;
using SqlServices = ApiReservaRes.Data;
using ApiReservaRes.Models;
using System.Net;
using System.Web.Services.Description;
using System.Linq;
using ApiReservaRes.Data;
using Microsoft.AspNetCore.Mvc;
using HttpPostAttribute = System.Web.Http.HttpPostAttribute;
using RouteAttribute = System.Web.Http.RouteAttribute;
using FromBodyAttribute = System.Web.Http.FromBodyAttribute;
using HttpGetAttribute = System.Web.Http.HttpGetAttribute;


namespace ApiReservaRes.Controllers
{
    public class ComplejosController : ApiController
    {
        [HttpPost]
        [Route("api/complejo/mensaje-entrada")]
        public async Task<int> MensajeEntrada([FromBody] Complejos item)
        //public string Get(int id)
        {
            //return "value: " + id;
            try
            {
                return 1;


            }
            catch (Exception ex)
            {
                //return ex.Message;
                throw WebServiceUtils.generarHTTPException(ex.Message);
            }
        }

        [HttpGet]
        [Route("api/complejo/listado")]
        public IHttpActionResult traerComplejos()
        {

            try
            {
                var complejos = ComplejoDAL.TraerListadoComplejo();
                return Ok(complejos);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/Complejo/Agregar")]
        public Complejos crearComplejo([FromBody] Complejos complejo)
        {
            if (complejo == null)
            {
                return  null;
               
            }

            return ComplejoDAL.agregarComplejo(complejo);
           
         
        }

        [HttpPost]
        [Route("api/Complejo/Editar")]
        public Complejos editarComplejo([FromBody] Complejos complejo)
        {
            if (complejo == null)
            {
                return null;
            }

            return ComplejoDAL.editarComplejo(complejo);


        }

        [HttpGet]
        [Route("api/Complejo/eliminar/{complejoId}")]
        public IHttpActionResult EliminarComplejo(int complejoId)
        {

            try
            {
                Boolean ban = ComplejoDAL.eliminarComplejo(complejoId);
                return Ok(ban);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        [HttpGet]
        [Route("api/Complejo/traerComplejoXUsuario/{usuarioId}")]
        public IHttpActionResult traerComplejoXUsuario(int usuarioId)
        {

            try
            {
                var complejos = ComplejoDAL.traerComplejosUsuario(usuarioId);
                return Ok(complejos);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
