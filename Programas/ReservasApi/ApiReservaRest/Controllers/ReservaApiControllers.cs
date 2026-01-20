using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ApiReservaRest.Controllers
{
    public class ReservaApiControllers : Controller
    {
      
       
        [HttpGet]
        [Route("LeerPerfil/{id}")]
        public String Get(int id)
        {
            return id switch
            {
                1 => "ivan",
                2 => "juan",
            };
        }

       

      
    }
}
