using System;
using System.Collections.Generic;

namespace ApiReservaRes.Modelos
{
    public class MessagesRespuesta
    {
        public int? id { get; set; }
        public string content { get; set; }
        public int? inbox_id { get; set; }
        public int? conversation_id { get; set; }
        public int? message_type { get; set; }
        public string content_type { get; set; }
        public string status { get; set; }
        public ContentAttributes content_attributes { get; set; }
        public int? created_at { get; set; }
        public bool @private { get; set; }
        public object source_id { get; set; }
        public Sender sender { get; set; }

    }

}
