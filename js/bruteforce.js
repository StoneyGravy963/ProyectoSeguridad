/**
 * Intenta descifrar un texto con todas las combinaciones posibles:
 * @param {string} text    - Texto cifrado a analizar
 * @param {string} charset - Conjunto de caracteres usado al cifrar
 * @returns {{ cipher: string, shift: number|null, resultado: string }[]}
 */
// [23]
function bruteforceAnalyze(text, charset) {
  const results = [];

  // Atbash: unica posibilidad
  try {
    const resultado = atbashDecrypt(text, charset);
    results.push({ cipher: "Atbash", shift: null, resultado });
  } catch (_) {}

  // probar cada desplazamiento posible dentro del charset
  const len = charset.length;
  for (let shift = 1; shift < len; shift++) {
    try {
      const resultado = caesarDecrypt(text, charset, shift);
      results.push({ cipher: "César", shift, resultado });
    } catch (_) {}
  }

  return results;
}
