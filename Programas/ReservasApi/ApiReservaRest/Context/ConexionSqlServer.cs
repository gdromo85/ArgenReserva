using ApiReservaRest.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiReservaRest.Context
{
    public class ConexionSqlServer:DbContext
    {
        public ConexionSqlServer(DbContextOptions<ConexionSqlServer> options) : base(options) {

        }
        public DbSet <Complejos> Complejos { get; set; }
    }
}
