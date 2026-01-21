export function getColorTailwind(valor: number, min: number, max: number) {
  if (valor < min) {
    return "text-green-700";
  } else if (valor >= min && valor <= max) {
    return "text-yellow-700";
  } else {
    return "text-red-700";
  }
}