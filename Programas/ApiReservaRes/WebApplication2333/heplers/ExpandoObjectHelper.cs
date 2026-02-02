using System;
using System.Collections.Generic;
using System.Dynamic;

namespace ApiReservaRes.utils
{
    public static class ExpandoObjectHelper
    {
        public static bool HasProperty(ExpandoObject obj, string propertyName)
        {
            try
            {
                bool estado = obj != null && ((IDictionary<String, object>)obj).ContainsKey(propertyName);
                return estado;
            } catch(Exception e)
            {
                return false;
            }
            
        }
    }
}
