# AGENTS.md - ApiReservaRes Development Guide

## Project Overview
- **Type**: ASP.NET Web API 2 (Framework 4.8)
- **Framework**: .NET Framework 4.8
- **JSON Library**: Newtonsoft.Json 13.0.3
- **Target**: IIS Express / IIS
- **Language**: C#

## Build Commands

### Building the Project
```bash
# Using MSBuild (requires .NET Framework installed)
msbuild ApiReservaRes.sln /p:Configuration=Release /p:Platform="Any CPU"

# Using Visual Studio (GUI)
# Open ApiReservaRes.sln and press Ctrl+Shift+B
```

### Restore NuGet Packages
```bash
# Using NuGet CLI
nuget restore ApiReservaRes.sln

# Or via Visual Studio - Right-click solution > Restore NuGet Packages
```

### Running the API
```bash
# Via Visual Studio - Press F5 or Ctrl+F5
# API runs on IIS Express (default port: 62115)
```

### No Test Framework
This project does **not** currently have a test project (no MSTest, NUnit, or xUnit). 
To add tests, create a separate test project and reference the main project.

## Project Structure

```
ApiReservaRes/
├── WebApplication2333/
│   ├── Controllers/       # API Controllers (ApiController)
│   ├── Models/            # POCO classes
│   ├── Data/              # DAL (Data Access Layer) - static classes
│   ├── heplers/           # Helpers (note: typo - should be "helpers")
│   ├── utils/             # Utility classes
│   ├── App_Start/         # Configuration (WebApiConfig, RouteConfig, etc.)
│   └── Web.config         # Configuration file
└── ApiReservaRes.sln      # Solution file
```

## Code Style Guidelines

### Naming Conventions
- **Classes/Models**: PascalCase (e.g., `Complejos`, `UsuarioController`)
- **Methods**: PascalCase (e.g., `TraerListadoComplejo`, `agregarComplejo`)
- **Properties**: PascalCase (e.g., `ComplejoID`, `Nombre`)
- **Parameters**: camelCase (e.g., `usuarioId`, `complejo`)
- **Private fields**: Not used (prefer local variables)
- **DAL Methods**: Static methods, verb-based naming (e.g., `TraerListadoComplejo`, `agregarComplejo`)

### File Organization
- **One class per file**: Follow existing pattern
- **Namespace**: `ApiReservaRes.{FolderName}` (e.g., `ApiReservaRes.Controllers`, `ApiReservaRes.Data`)
- **Imports/Usings**: 
  - System namespaces first
  - Third-party libraries next (Newtonsoft.Json)
  - Project namespaces last
  - Type aliases for attribute disambiguation (see below)

### Type Aliases Pattern
This codebase uses type aliases to avoid namespace conflicts:
```csharp
using HttpGetAttribute = System.Web.Http.HttpGetAttribute;
using HttpPostAttribute = System.Web.Http.HttpPostAttribute;
using RouteAttribute = System.Web.Http.RouteAttribute;
using FromBodyAttribute = System.Web.Http.FromBodyAttribute;
```

### Model Classes
```csharp
namespace ApiReservaRes.Models
{
    public class Complejos
    {
        public int ComplejoID { get; set; }
        public string Nombre { get; set; }
        public string Direccion { get; set; }
        public string Telefono { get; set; }
        public string Descripcion { get; set; }
    }
}
```

### Controller Pattern
```csharp
namespace ApiReservaRes.Controllers
{
    public class ComplejosController : ApiController
    {
        [HttpGet]
        [Route("api/complejo/listado")]
        public List<Complejos> traerComplejos()
        {
            try
            {
                return ComplejoDAL.TraerListadoComplejo();
            }
            catch (Exception ex)
            {
                throw WebServiceUtils.generarHTTPException(ex.Message);
            }
        }
    }
}
```

### DAL Pattern (Data Access Layer)
- Use static methods
- Use `using` for SqlConnection disposal
- Use stored procedures
- Handle DBNull.Value for nullable columns
- Always close connection in finally block (or use using statement)

```csharp
public static List<Complejos> TraerListadoComplejo()
{
    var listObjeto = new List<Complejos>();
    using (SqlConnection oConexion = new SqlConnection(Conexion.obtenerRutaConexion()))
    {
        SqlCommand cmd = new SqlCommand("spComplejoSel", oConexion);
        cmd.CommandType = CommandType.StoredProcedure;
        cmd.Connection = oConexion;
        try
        {
            oConexion.Open();
            using (SqlDataReader dr = cmd.ExecuteReader())
            {
                while (dr.Read())
                {
                    Complejos objeto = new Complejos();
                    objeto.ComplejoID = Convert.ToInt32(dr["ComplejoID"]);
                    if (dr["Nombre"] != DBNull.Value) objeto.Nombre = dr["Nombre"].ToString();
                    // ... other fields
                    listObjeto.Add(objeto);
                }
            }
            return listObjeto;
        }
        catch (Exception ex)
        {
            throw ex;
        }
    }
}
```

### Error Handling
- Use try-catch blocks in controllers and DAL
- Throw exceptions with meaningful messages
- Use `WebServiceUtils.generarHTTPException()` for HTTP error responses
- Avoid empty catch blocks
- Don't use `throw ex;` - use `throw;` to preserve stack trace (or don't catch if you can't handle it)

### JSON Configuration
The API returns JSON by default. Configuration is in `App_Start/WebApiConfig.cs`:
```csharp
config.Formatters.JsonFormatter.SerializerSettings.ReferenceLoopHandling = 
    Newtonsoft.Json.ReferenceLoopHandling.Ignore;
config.Formatters.Remove(config.Formatters.XmlFormatter);
```

### Database Connections
- Use `Conexion.obtenerRutaConexion()` to get connection string
- Always use stored procedures (not raw SQL)
- Use parameterized queries to prevent SQL injection

### Important Notes
- **Spelling**: The folder `heplers/` is misspelled (should be `helpers`) - do not fix this as it would break existing imports
- **Framework Version**: This is .NET Framework 4.8, not .NET Core/.NET 6+
- **CORS**: Enabled for all origins (`"*", "*", "*"`) in WebApiConfig

## Common API Endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | /api/complejo/listado | Get all complejos |
| POST | /api/Complejo/Agregar | Create complejo |
| POST | /api/Complejo/Editar | Update complejo |
| GET | /api/Usuario/listado/{usuarioId} | Get user by ID |
| POST | /api/Usuario/validarUsuario | Validate user credentials |

## Development Workflow
1. Make changes to controllers/models/DAL
2. Build the solution (Ctrl+Shift+B in Visual Studio)
3. Test via HTTP client (Postman, curl, or browser)
4. Check for compilation errors

## Dependencies
- Newtonsoft.Json 13.0.3
- Microsoft.AspNet.WebApi.Core 5.3.0
- Microsoft.AspNet.Mvc 5.3.0
- System.Data.SqlClient
