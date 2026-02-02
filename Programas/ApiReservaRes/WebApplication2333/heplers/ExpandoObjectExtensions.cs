using System.Collections.Generic;
using System.Dynamic;


namespace ApiReservaRes.utils
{
    public static class ExpandoObjectExtensions
    {
        public static ExpandoObject Merge(this ExpandoObject obj1, ExpandoObject obj2)
        {
            var result = new ExpandoObject();
            var resultDict = (IDictionary<string, object>)result;

            // Agregar propiedades del primer objeto
            if (obj1 != null)
            {
                foreach (var prop in (IDictionary<string, object>)obj1)
                {
                    resultDict[prop.Key] = prop.Value;
                }
            }

            // Agregar propiedades del segundo objeto (sobrescribiendo si existen duplicados)
            if (obj2 != null)
            {
                foreach (var prop in (IDictionary<string, object>)obj2)
                {
                    resultDict[prop.Key] = prop.Value;
                }
            }

            return result;
        }
    }
}
