using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using ApiReservaRes.Data;
using HttpGetAttribute = System.Web.Http.HttpGetAttribute;
using RouteAttribute = System.Web.Http.RouteAttribute;

namespace ApiReservaRes.Controllers
{
    public class UsuarioController : ApiController
    {

        [HttpGet]
        [Route("api/Usuario/listado/{usuarioId}")]
        public IHttpActionResult traerUsuario(int usuarioId)
        {

            try
            {
                var usuarios = UsuarioDAL.TraerListadoUsuario(usuarioId);
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}