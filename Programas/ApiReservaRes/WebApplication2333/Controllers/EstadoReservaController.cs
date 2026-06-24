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
    public class EstadoReservaController : ApiController
    {
       

        [HttpGet]
        [Route("api/estadoReserva/traer")]
        public IHttpActionResult traerEstadosReserva()
        {

            try
            {
                var complejos = EstadoReservaDAL.TraerEstados();
                return Ok(complejos);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

       

    }
}
