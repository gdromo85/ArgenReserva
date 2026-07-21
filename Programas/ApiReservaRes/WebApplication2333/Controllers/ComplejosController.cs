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
        [Route("api/Complejo/Agregar/{usuarioId}")]
        public Complejos crearComplejo(int usuarioId, [FromBody] Complejos complejo)
        {
            if (complejo == null)
            {
                return null;
            }

            return ComplejoDAL.agregarComplejo(complejo, usuarioId);
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
        [Route("api/Complejo/eliminar/{complejoId}/{usuarioId}")]
        public IHttpActionResult EliminarComplejo(int complejoId, int usuarioId)
        {
            try
            {
                Boolean ban = ComplejoDAL.eliminarComplejo(complejoId, usuarioId);
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
