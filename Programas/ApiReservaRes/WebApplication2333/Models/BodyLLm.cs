using System.Collections.Generic;

namespace ApiReservaRes.Modelos
{
    public class Llm
    {
        public object startTime { get; set; }
        public int executionTime { get; set; }
        public int executionIndex { get; set; }
        public string executionStatus { get; set; }
        public List<Source> source { get; set; }
        public Data data { get; set; }
        public InputOverride inputOverride { get; set; }
        public Metadata metadata { get; set; }
    }


    // Root myDeserializedClass = JsonConvert.DeserializeObject<List<Root>>(myJsonResponse);
    public class Data
    {
        public List<List<Ai_languageModel>> ai_languageModel { get; set; }
    }

    public class InputOverride
    {
        public List<List<Ai_languageModel1>> ai_languageModel { get; set; }
    }

    public class Metadata
    {
        public List<SubRun> subRun { get; set; }
    }

    public class Source
    {
        public string previousNode { get; set; }
        public int previousNodeRun { get; set; }
    }

    public class SubRun
    {
        public string node { get; set; }
        public int runIndex { get; set; }
    }

    //////////
    public class Configuration
    {
        public string baseURL { get; set; }
    }

    public class Json
    {
        public Response response { get; set; }
        public TokenUsage tokenUsage { get; set; }
    }
    public class Response
    {
        public List<List<ResponseItem>> generations { get; set; }
    }

    public class GenerationInfo
    {
        public int prompt { get; set; }
        public int completion { get; set; }
        public string finish_reason { get; set; }
        public string system_fingerprint { get; set; }
        public string model_name { get; set; }
    }

    public class ResponseItem
    {
        public string text { get; set; }
        public GenerationInfo generationInfo { get; set; }
    }

    public class TokenUsage
    {
        public int completionTokens { get; set; }
        public int promptTokens { get; set; }
        public int totalTokens { get; set; }
    }

    public class ModelKwargs
    {
    }

    public class OpenaiApiKey
    {
        public int lc { get; set; }
        public string type { get; set; }
        public List<string> id { get; set; }
    }

    public class Options
    {
        public OpenaiApiKey openai_api_key { get; set; }
        public string model { get; set; }
        public double temperature { get; set; }
        public int timeout { get; set; }
        public int max_retries { get; set; }
        public Configuration configuration { get; set; }
        public ModelKwargs model_kwargs { get; set; }
    }

    public class Ai_languageModel
    {
        public Json json { get; set; }
    }

    public class Ai_languageModel1
    {
        public Json1 json { get; set; }
    }

    public class Json1
    {
        public List<string> messages { get; set; }
        public int estimatedTokens { get; set; }
        public Options options { get; set; }
    }

}
