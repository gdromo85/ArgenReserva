using Newtonsoft.Json;
using RestSharp;
using Swashbuckle.Swagger;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Services.Description;
using WebApplication.Models;
using static System.Net.Mime.MediaTypeNames;

namespace WebApplication.Controllers
{
    
        public class webhookController : ApiController
        {
            static string urlBase = ConfigurationManager.AppSettings["urlBase"];
            
            public int Get()
            {
                string mode = "";
                string verify_token = "";
                int challenge = 0;

                foreach (var parameter in Request.GetQueryNameValuePairs())
                {
                    var key = parameter.Key;
                    var value = parameter.Value;
                    if (key == "hub.mode") mode = value;
                    if (key == "hub.verify_token") verify_token = value;
                    if (key == "hub.challenge") challenge = Int32.Parse(value);

                }

                if (mode == "subscribe" && verify_token == "Guille")
                {
                    return challenge;
                }
                else
                {
                    throw new HttpResponseException(HttpStatusCode.Forbidden);
                }



            }
            public string Post([FromBody] MensajeRecibido oDatos)
            {
                Console.WriteLine("webhook");

                string jsonString = JsonConvert.SerializeObject(oDatos);


                Console.WriteLine(jsonString);

                if (oDatos.entry[0].changes[0].value.messages != null)
                {
                    string typeMessages = oDatos.entry[0].changes[0].value.messages[0].type;
                    string MensajeRespuestaTexto = "";

                    switch (typeMessages)
                    {
                        case "text":
                            MensajeRespuestaTexto = oDatos.entry[0].changes[0].value.messages[0].text?.body;
                            break;
                        case "button":
                            MensajeRespuestaTexto = oDatos.entry[0].changes[0].value.messages[0].button?.text;
                            break;
                        default:
                            MensajeRespuestaTexto = oDatos.entry[0].changes[0].value.messages[0].text?.body;
                            break;
                    }
                    string contextId = "";

                    if (oDatos.entry[0].changes[0].value.messages[0].context != null)
                    {
                        contextId = oDatos.entry[0].changes[0].value.messages[0].context.id;
                    }

                    BuzonDeEntrada buzonDeEntrada = new BuzonDeEntrada();
                    buzonDeEntrada.telefono = oDatos.entry[0].changes[0].value.messages[0].from;
                    buzonDeEntrada.idEntry = oDatos.entry[0].id;
                    buzonDeEntrada.waid = oDatos.entry[0].changes[0].value.messages[0].id;
                    DateTimeOffset respuestaFecha = DateTimeOffset.FromUnixTimeSeconds(oDatos.entry[0].changes[0].value.messages[0].timestamp);
                    buzonDeEntrada.respuestaFecha = respuestaFecha;
                    buzonDeEntrada.mensajeRespuestaTexto = MensajeRespuestaTexto;
                    buzonDeEntrada.jsonString = jsonString;
                    buzonDeEntrada.contextId = contextId;

                    Boolean response = new Boolean();

                    try
                    {

                        string body = JsonConvert.SerializeObject((object)new
                        {
                            buzonDeEntrada = buzonDeEntrada
                        });
                        string str = urlBase + "whatsappapioficial/grabarRespuesta";
                        RestClient restClient = new RestClient(str);
                        RestRequest request = new RestRequest(str, Method.Post);
                        //request.AddHeader("Authorization", Constants.dealsAccessToken);
                        request.AddHeader("Content-Type", "application/json");
                        request.AddParameter("application/json", (object)body, ParameterType.RequestBody);

                        var respuesta = restClient.Execute(request);

                        response = JsonConvert.DeserializeObject<Boolean>((respuesta).Content);
                        //this._logger.Write(JsonConvert.SerializeObject((object)respuesta), "Deal Created Result");


                    }
                    catch (Exception ex)
                    {
                        Console.Write("Error grabarRespuesta: " + ex.StackTrace + "\n" + ex.Message + "\n");

                        throw ex;

                    }
                
                }
                if (oDatos.entry[0].changes[0].value.statuses != null)
                {
                    DateTimeOffset respuestaFecha = DateTimeOffset.FromUnixTimeSeconds(oDatos.entry[0].changes[0].value.statuses[0].timestamp);
                    Boolean response = new Boolean();
                    
                    try
                    {
                        EstadoMensaje estadoMensaje = new EstadoMensaje();
                        estadoMensaje.waid = oDatos.entry[0].changes[0].value.statuses[0].id;
                        estadoMensaje.status = oDatos.entry[0].changes[0].value.statuses[0].status;
                        estadoMensaje.respuestaFecha = respuestaFecha;
                        estadoMensaje.telefono = oDatos.entry[0].changes[0].value.statuses[0].recipient_id;
                        string jsonError = JsonConvert.SerializeObject(oDatos.entry[0].changes[0].value.statuses[0].errors);
                        estadoMensaje.error = jsonError;

                        string body = JsonConvert.SerializeObject((object)new
                        {
                            estadoMensaje = estadoMensaje    
                        });

                        string str = urlBase + "whatsappapioficial/grabarEstado";
                        RestClient restClient = new RestClient(str);
                        RestRequest request = new RestRequest(str, Method.Post);
                        //request.AddHeader("Authorization", Constants.dealsAccessToken);
                        request.AddHeader("Content-Type", "application/json");
                        request.AddParameter("application/json", (object)body, ParameterType.RequestBody);

                        var respuesta = restClient.Execute(request);

                        response = JsonConvert.DeserializeObject<Boolean>((respuesta).Content);
                        //this._logger.Write(JsonConvert.SerializeObject((object)respuesta), "Deal Created Result");


                    }
                    catch (Exception ex)
                    {
                        Console.Write("Error grabarRespuesta: " + ex.StackTrace + "\n" + ex.Message + "\n");

                        throw ex;

                    }

            }
                return "Ok";
            }

        }
    }

