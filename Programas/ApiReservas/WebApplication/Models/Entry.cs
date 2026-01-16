
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace WebApplication.Models
{
    
    public class Entry
    {
        public string id { get; set; }
        public IList<Changes> changes { get; set; }

    }
}

