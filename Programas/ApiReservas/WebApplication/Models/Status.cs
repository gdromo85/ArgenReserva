
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication.Models
{
    public class Status
    {
        public string id { get; set; }
        public string status { get; set; }
        public long timestamp { get; set; }
        public string recipient_id { get; set; }
        public List<Error> errors { get; set; }
    }

}

