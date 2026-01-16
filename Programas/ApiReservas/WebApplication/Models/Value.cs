
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication.Models
{
    
    public class Value
    {
        public string messaging_product { get; set; }
        public Metadata metadata { get; set; }
        public IList<Contacts> contacts { get; set; }
        public IList<Messages> messages { get; set; }
        public List<Status> statuses { get; set; }

    }
}

