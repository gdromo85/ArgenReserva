using ApiReservaRest.Context;
using ApiReservaRest.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace ApiReservaRest.Controllers
{
    public class ComplejosController : Controller
    {
        private readonly ConexionSqlServer context;

        public ComplejosController(ConexionSqlServer context)
        {
            this.context = context;
        }



        [HttpGet]
        [Route("Complejos")]
        public async Task<IActionResult> GetComplejos()
        {
            var complejos = await context.Complejos.ToListAsync();
            return Ok(complejos);
        }

        [HttpGet("Complejo/{id}")]
        public async Task<IActionResult> GetComplejo(int id)
        {
            var complejo = await context.Complejos
                                        .FirstOrDefaultAsync(c => c.ComplejoID == id);

            if (complejo == null)
                return NotFound();

            return Ok(complejo);
        }

        // GET: ComplejosController
        public ActionResult Index()
        {
            return View();
        }

        // GET: ComplejosController/Details/5
        public ActionResult Details(int id)
        {
            return View();
        }

        // GET: ComplejosController/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: ComplejosController/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ComplejosController/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: ComplejosController/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: ComplejosController/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: ComplejosController/Delete/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Delete(int id, IFormCollection collection)
        {
            try
            {
                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }
    }
}
