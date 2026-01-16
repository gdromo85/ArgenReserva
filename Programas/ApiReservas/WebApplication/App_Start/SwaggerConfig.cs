
using WebActivatorEx;
using WebApplication;
using Swashbuckle.Application;
using System.IO;
using System.Web.Http;

[assembly: PreApplicationStartMethod(typeof(SwaggerConfig), "Register")]

namespace WebApplication
{
    public class SwaggerConfig
    {
        // OBTENEMOS EL PATH DEL ARCHIVO XML DE DOCUMENTACIÓN.
        protected static string GetXmlCommentsPath()
        {
            return Path.Combine(System.Web.HttpRuntime.AppDomainAppPath, "bin", "WebApplication.xml");
        }

        public static void Register()
        {
            var thisAssembly = typeof(SwaggerConfig).Assembly;

            GlobalConfiguration.Configuration
                // HABILITAMOS SWAGGER EN EL PROYECTO.
                .EnableSwagger(c =>
                {
                    // Use "SingleApiVersion" to describe a single version API. Swagger 2.0 includes an "Info" object to
                    // hold additional metadata for an API. Version and title are required but you can also provide
                    // additional fields by chaining methods off SingleApiVersion.
                    //
                    // DEFINIMOS LAS CARACTERÍSTICAS DEL WEB API.
                    c.SingleApiVersion("v1", "WebHook WhatsApp API")
                        .Description("http://localhost:62115/webhook/docs/v1/docs.json");
                        //.TermsOfService("Términos de servicio.")
                        //.Contact(x => x
                        //    .Name("Rafael Acosta")
                        //    .Url("http://www.rafaelacosta.net/api-doc.pdf")
                        //    .Email("info@rafaelacosta.net"))
                        //.License(x => x
                        //    .Name("Licencia")
                        //    .Url("http://www.rafaelacosta.net/license"));

                    // If you annotate Controllers and API Types with
                    // Xml comments (http://msdn.microsoft.com/en-us/library/b2s063f7(v=vs.110).aspx), you can incorporate
                    // those comments into the generated docs and UI. You can enable this by providing the path to one or
                    // more Xml comment files.
                    //
                    // HABILITAMOS EL ARCHIVO DE DOCUMENTACIÓN XML.
                    c.IncludeXmlComments(GetXmlCommentsPath());

                    // NOTE: You must also configure 'EnableApiKeySupport' below in the SwaggerUI section
                    //
                    // HABILITAMOS LA AUTENTICACIÓN JWT.
                    //c.ApiKey("Authorization")
                    //.Description("Introduce el Token JWT aquí.")
                    //.Name("Bearer")
                    //.In("header");

                    // If you want the output Swagger docs to be indented properly, enable the "PrettyPrint" option.
                    //
                    c.PrettyPrint();
                })
                // HABILITAMOS LA INTERFAZ SWAGGER.
                .EnableSwaggerUi(c =>
                {
                    // If your API supports ApiKey, you can override the default values.
                    // "apiKeyIn" can either be "query" or "header"
                    //
                    // HABILITAMOS LA AUTENTICACIÓN JWT EN LA INTERFAZ.
                    //c.EnableApiKeySupport("Authorization", "header");

                    // Use the "DocumentTitle" option to change the Document title.
                    // Very helpful when you have multiple Swagger pages open, to tell them apart.
                    //
                    //c.DocumentTitle("My Swagger UI");

                });
        }
    }
}
