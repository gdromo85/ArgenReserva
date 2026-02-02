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
        public IHttpActionResult HolaMundo()
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


    }
}
