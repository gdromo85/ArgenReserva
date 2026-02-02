using System.Collections.Generic;

namespace ApiReservaRes.Modelos
{
    public class MensajeEntrada
    {
        
        public string id { get; set; }
        public Contacto contacto { get; set; }
        public string mensaje { get; set; }
        public string canal { get; set; }
        public List<string> etiquetas { get; set; }
    }


}
