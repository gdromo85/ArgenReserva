import React from "react";

interface KeyTagProps {
  label: string;
  className?: string;
}

/**
 * Ficha de llave: elemento de marca reutilizado donde se identifica una
 * Unidad de Alojamiento (evoca la etiqueta física de una llave de habitación).
 */
const KeyTag: React.FC<KeyTagProps> = ({ label, className = "" }) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-md border border-amber-300 bg-amber-100 py-1 pl-2 pr-2.5 font-mono text-xs font-medium text-amber-900 ${className}`}
  >
    <span className="h-1.5 w-1.5 rounded-full border border-amber-400 bg-white" aria-hidden="true" />
    {label}
  </span>
);

export default KeyTag;
