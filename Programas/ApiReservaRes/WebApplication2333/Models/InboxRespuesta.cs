using System.Collections.Generic;

namespace ApiReservaRes.Modelos
{
    public class InboxRespuesta
    {
        public int? id { get; set; }
        public string avatar_url { get; set; }
        public int? channel_id { get; set; }
        public string name { get; set; }
        public string channel_type { get; set; }
        public bool greeting_enabled { get; set; }
        public object greeting_message { get; set; }
        public bool working_hours_enabled { get; set; }
        public bool enable_email_collect { get; set; }
        public bool csat_survey_enabled { get; set; }
        public CsatConfig csat_config { get; set; }
        public bool enable_auto_assignment { get; set; }
        public AutoAssignmentConfig auto_assignment_config { get; set; }
        public object out_of_office_message { get; set; }
        public List<WorkingHour> working_hours { get; set; }
        public string timezone { get; set; }
        public object callback_webhook_url { get; set; }
        public bool allow_messages_after_resolved { get; set; }
        public bool lock_to_single_conversation { get; set; }
        public string sender_name_type { get; set; }
        public object business_name { get; set; }
        public object widget_color { get; set; }
        public object website_url { get; set; }
        public bool hmac_mandatory { get; set; }
        public object welcome_title { get; set; }
        public object welcome_tagline { get; set; }
        public object web_widget_script { get; set; }
        public object website_token { get; set; }
        public object selected_feature_flags { get; set; }
        public object reply_time { get; set; }
        public object messaging_service_sid { get; set; }
        public object phone_number { get; set; }
        public string hmac_token { get; set; }
        public string webhook_url { get; set; }
        public string inbox_identifier { get; set; }
        public AdditionalAttributes additional_attributes { get; set; }
        public object provider { get; set; }
        public string error { get; set; }

    }
    public class WorkingHour
    {
        public int? day_of_week { get; set; }
        public bool closed_all_day { get; set; }
        public int? open_hour { get; set; }
        public int? open_minutes { get; set; }
        public int? close_hour { get; set; }
        public int? close_minutes { get; set; }
        public bool open_all_day { get; set; }
    }

    public class AutoAssignmentConfig
    {
    }

    public class CsatConfig
    {
    }
}
