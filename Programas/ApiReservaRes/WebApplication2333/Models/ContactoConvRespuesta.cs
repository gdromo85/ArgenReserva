using System;
using System.Collections.Generic;

namespace ApiReservaRes.Modelos
{
    public class ContactoConvRespuesta
    {
        public List<Payload> payload { get; set; }

    }

    public class LastNonActivityMessage
    {
        public int? id { get; set; }
        public string content { get; set; }
        public int? account_id { get; set; }
        public int? inbox_id { get; set; }
        public int? conversation_id { get; set; }
        public int? message_type { get; set; }
        public int? created_at { get; set; }
        public DateTime updated_at { get; set; }
        public bool @private { get; set; }
        public string status { get; set; }
        public object source_id { get; set; }
        public string content_type { get; set; }
        public ContentAttributes content_attributes { get; set; }
        public string sender_type { get; set; }
        public int? sender_id { get; set; }
        public ExternalSourceIds external_source_ids { get; set; }
        public AdditionalAttributes additional_attributes { get; set; }
        public string processed_message_content { get; set; }
        public Sentiment sentiment { get; set; }
        public Conversation conversation { get; set; }
        public Sender sender { get; set; }
    }


}
