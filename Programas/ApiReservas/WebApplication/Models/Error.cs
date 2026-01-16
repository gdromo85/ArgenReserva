
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication.Models
{
    public class Error
    {
        public int code { get; set; }
        public string title { get; set; }
        public string message { get; set; }
        public ErrorData error_data { get; set; }
    }

}

