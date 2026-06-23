using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using ApiReservaRes.Data;
using ApiReservaRes.Models;
using HttpPostAttribute = System.Web.Http.HttpPostAttribute;
using RouteAttribute = System.Web.Http.RouteAttribute;
using FromBodyAttribute = System.Web.Http.FromBodyAttribute;
using HttpGetAttribute = System.Web.Http.HttpGetAttribute;



namespace ApiReservaRes.Controllers
{
    public class UnidadAlojamientoController : ApiController
    {
        [HttpGet]
        [Route("api/UnidadAlojamiento/traerTodos/{complejoId}")]
        public IHttpActionResult traerCabana(int complejoId)
        {

            try
            {
                var usuarios = UnidadAlojamientoDAL.traerUnidadesAlojamiento(complejoId);
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/UnidadAlojamiento/Agregar")]
        public UnidadAlojamiento crearUnidadAlojamiento([FromBody] UnidadAlojamiento unidad)
        {
            if (unidad == null)
            {
                return null;

            }

            return UnidadAlojamientoDAL.agregarUnidadAlojamiento(unidad);


        }

        [HttpPost]
        [Route("api/UnidadAlojamiento/Editar")]
        public UnidadAlojamiento editarComplejo([FromBody] UnidadAlojamiento unidadAlojamiento)
        {
            if (unidadAlojamiento == null)
            {
                return null;
            }

            return UnidadAlojamientoDAL.editarUnidadAlojamiento(unidadAlojamiento);


        }

        [HttpGet]
        [Route("api/UnidadAlojamiento/eliminar/{unidadAlojamientoId}")]
        public IHttpActionResult EliminarComplejo(int unidadAlojamientoId)
        {

            try
            {
                Boolean ban = UnidadAlojamientoDAL.eliminarUnidadAlojamiento(unidadAlojamientoId);
                return Ok(ban);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
