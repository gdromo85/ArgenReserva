using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System;

using System.Net.Http;
using System.Net;
using System.Web.Http;
using Newtonsoft.Json;

namespace ApiReservaRes.utils

{
    public class WebServiceUtils
    {
        public static HttpResponseException generarHTTPException(String errorMessage)
        {
            var resp = new HttpResponseMessage(HttpStatusCode.BadRequest)
            {
                Content = new StringContent(errorMessage),
                ReasonPhrase = "Error"
            };
            throw new HttpResponseException(resp);
        }

        public static HttpResponseMessage generarHTTPResponseConvertingToJson(Object objeto)
        {
            String json = serializarToJsonIgnoringDefaults(objeto);
            return new HttpResponseMessage()
            {
                Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json")
            };
        }
        public static HttpResponseMessage generarHTTPResponse(String valor)
        {
            return new HttpResponseMessage()
            {
                Content = new StringContent(valor, System.Text.Encoding.UTF8, "application/json")
            };
        }

        public static String serializarToJsonIgnoringDefaults(Object objeto)
        {
            if (objeto == null)
            {
                return null;
            }
            JsonSerializerSettings settings = new JsonSerializerSettings();
            settings.NullValueHandling = NullValueHandling.Ignore;
            settings.DefaultValueHandling = DefaultValueHandling.Ignore;
            settings.DateFormatHandling = DateFormatHandling.MicrosoftDateFormat;

            String json = JsonConvert.SerializeObject(objeto, settings);

            return json;
        }
    }
}