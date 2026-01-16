
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication.Models
{
    public class Application2
    {

        [JsonPropertyName("hub.mode")]
        public string mode { get; set; }
        [JsonPropertyName("hub.verify_token")]
        public string verifyToken { get; set; }
        [JsonPropertyName("hub.challenge")]
        public string challenge { get; set; }
        public string cosas { get; set; }

    }
}

