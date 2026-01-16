
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication.Models
{
    public class MensajeRecibido
    {
        [JsonPropertyName("object")]
        public object object1 { get; set; }
        public List<Entry> entry { get; set; }
    }
}

