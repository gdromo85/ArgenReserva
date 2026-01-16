
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication.Models
{
    public class Messages
    {
        public string from { get; set; }
        public string id { get; set; }
        public long timestamp { get; set; }
        public Text text { get; set; }
        public string type { get; set; }
        public Context context { get; set; }
        public Button button { get; set; }
    }

}

