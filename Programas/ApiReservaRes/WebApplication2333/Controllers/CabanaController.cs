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
    public class CabanaController : ApiController
    {
        [HttpGet]
        [Route("api/Cabana/traerTodos/{complejoId}")]
        public IHttpActionResult traerCabana(int complejoId)
        {

            try
            {
                var usuarios = CabanaDAL.TraerCabanas(complejoId);
                return Ok(usuarios);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}
