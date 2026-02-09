using System.Collections.Generic;

namespace ApiReservaRes.Modelos
{
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);


    public class RespuestaWebhook
    {
        public Meta meta { get; set; }
        public List<Payload> payload { get; set; }
    }

    public class Payload
    {
        public AdditionalAttributes additional_attributes { get; set; }
        public string availability_status { get; set; }
        public string email { get; set; }
        public int? id { get; set; }
        public string name { get; set; }
        public string phone_number { get; set; }
        public bool blocked { get; set; }
        public object identifier { get; set; }
        public string thumbnail { get; set; }
        public CustomAttributes custom_attributes { get; set; }
        public int? last_activity_at { get; set; }
        public int? created_at { get; set; }
        public List<ContactInbox> contact_inboxes { get; set; }
 
        public ContactInbox contact_inbox { get; set; }

        public Meta meta { get; set; }
        public List<Message> messages { get; set; }
        public int? account_id { get; set; }
        public string uuid { get; set; }
        public int? agent_last_seen_at { get; set; }
        public int? assignee_last_seen_at { get; set; }
        public bool can_reply { get; set; }
        public int? contact_last_seen_at { get; set; }
        public int? inbox_id { get; set; }
        public List<object> labels { get; set; }
        public bool muted { get; set; }
        public object snoozed_until { get; set; }
        public string status { get; set; }
        public double updated_at { get; set; }
        public int? timestamp { get; set; }
        public int? first_reply_created_at { get; set; }
        public int? unread_count { get; set; }
     
        public object priority { get; set; }
        public int? waiting_since { get; set; }
        public object sla_policy_id { get; set; }
    }


}