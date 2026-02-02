using System;
using System.Collections.Generic;

namespace ApiReservaRes.Modelos
{
    // Root myDeserializedClass = JsonConvert.DeserializeObject<Root>(myJsonResponse);

    public class BodyWebhook
    {
        public Account account { get; set; }
        public AdditionalAttributes additional_attributes { get; set; }
        public string content { get; set; }
        public ContentAttributes content_attributes { get; set; }
        public string content_type { get; set; }
        public Conversation conversation { get; set; }
        public DateTime created_at { get; set; }
        public string @event { get; set; }
        public int? id { get; set; }
        public Inbox inbox { get; set; }
        public string message_type { get; set; }
        public bool @private { get; set; }
        public Sender sender { get; set; }
        public object source_id { get; set; }

        public bool can_reply { get; set; }
        public string channel { get; set; }
        public ContactInbox contact_inbox { get; set; }
        public int inbox_id { get; set; }
        public List<Message> messages { get; set; }
        public List<object> labels { get; set; }
        public Meta meta { get; set; }
        public string status { get; set; }
        public CustomAttributes custom_attributes { get; set; }
        public object snoozed_until { get; set; }
        public int unread_count { get; set; }
        public DateTime first_reply_created_at { get; set; }
        public object priority { get; set; }
        public int waiting_since { get; set; }
        public int agent_last_seen_at { get; set; }
        public int contact_last_seen_at { get; set; }
        public int last_activity_at { get; set; }
        public int timestamp { get; set; }
        public double updated_at { get; set; }
        public List<ChangedAttribute> changed_attributes { get; set; }
    }

    public class Account
    {
        public int? id { get; set; }
        public string name { get; set; }
    }

    public class AdditionalAttributes
    {
        public string mail_subject { get; set; }
        public string city { get; set; }
        public string company_name { get; set; }
        public string country { get; set; }
        public string country_code { get; set; }
        public string description { get; set; }
        public SocialProfiles social_profiles { get; set; }
        public TemplateParams template_params { get; set; }
        
    }

    public class TemplateParams
    {
        public string name { get; set; }
    }

    public class Assignee
    {
        public object availability_status { get; set; }
        public string available_name { get; set; }
        public string avatar_url { get; set; }
        public int? id { get; set; }
        public string name { get; set; }
        public string thumbnail { get; set; }
        public string type { get; set; }

    }

    public class ContactInbox
    {
        public int? contact_id { get; set; }
        public DateTime created_at { get; set; }
        public bool hmac_verified { get; set; }
        public int? id { get; set; }
        public int? inbox_id { get; set; }
        public string pubsub_token { get; set; }
        public string source_id { get; set; }
        public DateTime updated_at { get; set; }
        public object inbox { get; set; }

    }


    public class ContentAttributes
    {
    }
    public class Attachment
    {
        public int id { get; set; }
        public int message_id { get; set; }
        public string file_type { get; set; }
        public int account_id { get; set; }
        public object extension { get; set; }
        public string data_url { get; set; }
        public string thumb_url { get; set; }
        public int file_size { get; set; }
        public object width { get; set; }
        public object height { get; set; }
    }
    public class ChangedAttribute
    {
        public UpdatedAt updated_at { get; set; }
        public FirstReplyCreatedAt first_reply_created_at { get; set; }
        public WaitingSince waiting_since { get; set; }
        public CustomAttributes custom_attributes { get; set; }
    }
    public class CurrentValue
    {
        public bool usar_bot { get; set; }
        public bool no_usar_bot { get; set; }
    }

    

    public class PreviousValue
    {
        public bool usar_bot { get; set; }
        public bool no_usar_bot { get; set; }
    }
    public class UpdatedAt
    {
        public DateTime previous_value { get; set; }
        public DateTime current_value { get; set; }
    }

    public class Conversation
    {
        public AdditionalAttributes additional_attributes { get; set; }
        public int? agent_last_seen_at { get; set; }
        public bool can_reply { get; set; }
        public string channel { get; set; }
        public ContactInbox contact_inbox { get; set; }
        public int? contact_last_seen_at { get; set; }
        public int? created_at { get; set; }
        public CustomAttributes custom_attributes { get; set; }
        public DateTime first_reply_created_at { get; set; }
        public int? id { get; set; }
        public int? inbox_id { get; set; }
        public List<object> labels { get; set; }
        public int? last_activity_at { get; set; }
        public List<Message> messages { get; set; }
        public Meta meta { get; set; }
        public object priority { get; set; }
        public object snoozed_until { get; set; }
        public string status { get; set; }
        public int? timestamp { get; set; }
        public int? unread_count { get; set; }
        public double updated_at { get; set; }
        public int? waiting_since { get; set; }
        public int? assignee_id { get; set; }


    }
   
    public class FirstReplyCreatedAt
    {
        public object previous_value { get; set; }
        public DateTime current_value { get; set; }
    }
    public class CustomAttributes
    {
        public PreviousValue previous_value { get; set; }
        public CurrentValue current_value { get; set; }
    }

    public class ExternalSourceIds
    {
    }

    public class Inbox
    {
        public int? id { get; set; }
        public string name { get; set; }
    }

    public class Message
    {
        public int? account_id { get; set; }
        public AdditionalAttributes additional_attributes { get; set; }
        public string content { get; set; }
        public ContentAttributes content_attributes { get; set; }
        public string content_type { get; set; }
        public Conversation conversation { get; set; }
        public int? conversation_id { get; set; }
        public int? created_at { get; set; }
        public ExternalSourceIds external_source_ids { get; set; }
        public int? id { get; set; }
        public int? inbox_id { get; set; }
        public int? message_type { get; set; }
        public bool @private { get; set; }
        public string processed_message_content { get; set; }
        public Sender sender { get; set; }
        public int? sender_id { get; set; }
        public string sender_type { get; set; }
        public Sentiment sentiment { get; set; }
        public object source_id { get; set; }
        public string status { get; set; }
        public DateTime updated_at { get; set; }
        public List<Attachment> attachments { get; set; }

    }

    public class Meta
    {
        public Assignee assignee { get; set; }
        public bool hmac_verified { get; set; }
        public Sender sender { get; set; }
        public object team { get; set; }
        public int? count { get; set; }
        public int? current_page { get; set; }

    }

    

    public class Sender
    {
        public object availability_status { get; set; }
        public string available_name { get; set; }
        public string avatar_url { get; set; }
        public int? id { get; set; }
        public string name { get; set; }
        public string thumbnail { get; set; }
        public string type { get; set; }
        public AdditionalAttributes additional_attributes { get; set; }
        public bool blocked { get; set; }
        public CustomAttributes custom_attributes { get; set; }
        public string email { get; set; }
        public string identifier { get; set; }
        public string phone_number { get; set; }
        public int? last_activity_at { get; set; }
        public int? created_at { get; set; }

    }

    public class Sentiment
    {
    }
    
    public class WaitingSince
    {
        public DateTime previous_value { get; set; }
        public object current_value { get; set; }
    }
    public class SocialProfiles
    {
        public string facebook { get; set; }
        public string github { get; set; }
        public string instagram { get; set; }
        public string linkedin { get; set; }
        public string twitter { get; set; }
    }



}
