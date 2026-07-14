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
    public class ReservaController : ApiController
    {
        [HttpGet]
        [Route("api/reserva/listado")]
        public IHttpActionResult traerReservas()
        {
            try
            {
                var reservas = ReservaDAL.TraerListadoReserva();
                return Ok(reservas);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpGet]
        [Route("api/reserva/{reservaId}")]
        public IHttpActionResult traerReserva(int reservaId)
        {
            try
            {
                var reserva = ReservaDAL.traerReserva(reservaId);
                if (reserva == null) return NotFound();
                return Ok(reserva);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        [HttpPost]
        [Route("api/reserva/agregar")]
        public Reserva crearReserva([FromBody] Reserva reserva)
        {
            if (reserva == null)
            {
                return null;
            }
            return ReservaDAL.agregarReserva(reserva);
        }

        [HttpPost]
        [Route("api/reserva/editar")]
        public Reserva editarReserva([FromBody] Reserva reserva)
        {
            if (reserva == null)
            {
                return null;
            }
            return ReservaDAL.editarReserva(reserva);
        }

        [HttpGet]
        [Route("api/reserva/eliminar/{reservaId}")]
        public IHttpActionResult eliminarReserva(int reservaId)
        {
            try
            {
                Boolean ban = ReservaDAL.eliminarReserva(reservaId);
                return Ok(ban);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
    }
}