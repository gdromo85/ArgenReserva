using System.Collections.Generic;

namespace ApiReservaRes.Modelos
{
    public class ConversacionBody
    {
        
        public string contact_id { get; set; }
        public int? inbox_id { get; set; }
        public string status { get; set; }
        public int? assignee_id { get; set; }
        public int? team_id { get; set; }
        
    }


}
