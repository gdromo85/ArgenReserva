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
    public class TipoReservaController : ApiController
    {
        [HttpGet]
        [Route("api/tiporeserva/listado")]
        public IHttpActionResult traerTipoReservas()
        {
            try
            {
                var tiposReserva = TipoReservaDAL.TraerListadoTipoReserva();
                return Ok(tiposReserva);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/tiporeserva/{tipoReservaId}")]
        public IHttpActionResult traerTipoReserva(int tipoReservaId)
        {
            try
            {
                var tipoReserva = TipoReservaDAL.traerTipoReserva(tipoReservaId);
                return Ok(tipoReserva);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/tiporeserva/agregar")]
        public TipoReserva crearTipoReserva([FromBody] TipoReserva tipoReserva)
        {
            if (tipoReserva == null)
            {
                return null;
            }
            return TipoReservaDAL.agregarTipoReserva(tipoReserva);
        }

        [HttpPost]
        [Route("api/tiporeserva/editar")]
        public TipoReserva editarTipoReserva([FromBody] TipoReserva tipoReserva)
        {
            if (tipoReserva == null)
            {
                return null;
            }
            return TipoReservaDAL.editarTipoReserva(tipoReserva);
        }

        [HttpGet]
        [Route("api/tiporeserva/eliminar/{tipoReservaId}")]
        public IHttpActionResult EliminarTipoReserva(int tipoReservaId)
        {
            try
            {
                Boolean ban = TipoReservaDAL.eliminarTipoReserva(tipoReservaId);
                return Ok(ban);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}