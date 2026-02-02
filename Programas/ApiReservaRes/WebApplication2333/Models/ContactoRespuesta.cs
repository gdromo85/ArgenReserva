using System.Collections.Generic;

namespace ApiReservaRes.Modelos
{
    public class ContactoRespuesta
    {
        public Payload payload { get; set; }
        public string message { get; set; }
        public List<string> attributes { get; set; }

    }

    public class Contact
    {
        public AdditionalAttributes additional_attributes { get; set; }
        public string availability_status { get; set; }
        public string email { get; set; }
        public int? id { get; set; }
        public string name { get; set; }
        public string phone_number { get; set; }
        public bool blocked { get; set; }
        public string identifier { get; set; }
        public string thumbnail { get; set; }
        public CustomAttributes custom_attributes { get; set; }
        public int? created_at { get; set; }
        public List<object> contact_inboxes { get; set; }
    }

}
