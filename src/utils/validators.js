// Convierte un valor (por ejemplo "5" o 5) en un entero positivo.
// Si no es un entero positivo válido devuelve null.
function parseId(valor) {
  const texto = String(valor).trim();

  if (!/^\d+$/.test(texto)) {
    return null;
  }

  const numero = Number(texto);
  return Number.isSafeInteger(numero) && numero > 0 ? numero : null;
}

module.exports = { parseId };
