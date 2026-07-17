import React from "react";

interface BrandMarkProps {
  className?: string;
  /** "dark" (por defecto) para fondos claros, "light" para fondos pino oscuros como el nav */
  tone?: "dark" | "light";
}

/**
 * Marca de ArgenReservas: una llave estilizada. El punto bronce en el aro
 * es el mismo "agujero de ficha" que aparece en KeyTag, para que la marca
 * y las fichas de unidad se lean como parte del mismo sistema.
 */
const BrandMark: React.FC<BrandMarkProps> = ({ className = "h-8 w-8", tone = "dark" }) => {
  const strokeColor = tone === "light" ? "#FAF8F4" : "#2F5F47";
  return (
    <svg viewBox="0 0 40 24" className={className} fill="none" aria-hidden="true">
      <circle cx="8" cy="12" r="7" stroke={strokeColor} strokeWidth="3" />
      <circle cx="8" cy="12" r="2.2" fill="#DEB35F" />
      <path d="M15 12H34M28 12V18M34 12V17" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
};

export default BrandMark;
