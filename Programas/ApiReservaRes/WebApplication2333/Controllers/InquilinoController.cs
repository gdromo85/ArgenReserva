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
    public class InquilinoController : ApiController
    {
        [HttpGet]
        [Route("api/inquilino/listado")]
        public IHttpActionResult traerInquilinos()
        {
            try
            {
                var inquilinos = InquilinoDAL.TraerListadoInquilino();
                return Ok(inquilinos);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/inquilino/{inquilinoId}")]
        public IHttpActionResult traerInquilino(int inquilinoId)
        {
            try
            {
                var inquilino = InquilinoDAL.traerInquilino(inquilinoId);
                return Ok(inquilino);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/inquilino/agregar")]
        public Inquilino crearInquilino([FromBody] Inquilino inquilino)
        {
            if (inquilino == null)
            {
                return null;
            }
            return InquilinoDAL.agregarInquilino(inquilino);
        }

        [HttpPost]
        [Route("api/inquilino/editar")]
        public Inquilino editarInquilino([FromBody] Inquilino inquilino)
        {
            if (inquilino == null)
            {
                return null;
            }
            return InquilinoDAL.editarInquilino(inquilino);
        }

        [HttpGet]
        [Route("api/inquilino/eliminar/{inquilinoId}")]
        public IHttpActionResult EliminarInquilino(int inquilinoId)
        {
            try
            {
                Boolean ban = InquilinoDAL.eliminarInquilino(inquilinoId);
                return Ok(ban);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}