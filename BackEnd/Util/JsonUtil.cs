using Newtonsoft.Json;

namespace Util;

public static class JsonSettings
{
    public static readonly JsonSerializerSettings Default = new()
    {
        NullValueHandling = NullValueHandling.Ignore,
        DateFormatString = "yyyyMMdd",
        ContractResolver =
            new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver(),

        // Add other global settings here
    };
}
