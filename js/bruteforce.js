/**
 * bruteforce.js
 * Modulo de analisis por fuerza bruta con puntuacion automatica.
 */

// Palabras frecuentes del español usadas para puntuar cada resultado.
// Cuantas mas coincidan con el texto descifrado, mas probable es que sea el correcto.
// [26]
const PALABRAS_ES = [
  "el","la","los","las","de","del","en","que","y","a","un","una",
  "es","se","no","con","por","su","al","lo","como","pero","mas",
  "fue","si","sobre","este","esta","ya","entre","cuando","todo",
  "ser","son","dos","era","hasta","desde","nos","para","le","me",
  "mi","te","tu","hay","tiene","han","sido","muy","bien","puede",
  "sin","tiempo","mundo","hola","gracias","buenas","aqui","esto"
];

/**
 * Puntua un texto segun cuantas palabras frecuentes del español contiene.
 * Un puntaje mayor indica mayor probabilidad de ser texto legible.
 *
 * @param {string} text - Texto descifrado a evaluar
 * @returns {number} Cantidad de palabras del español encontradas
 */
// [27]
function scoreText(text) {
  const palabras = text.toLowerCase().match(/[a-záéíóúüñ]+/g) || [];
  return palabras.filter(p => PALABRAS_ES.includes(p)).length;
}

/**
 * Intenta descifrar un texto con todas las combinaciones posibles:
 * - Atbash (1 posibilidad)
 * - Cesar con shift = 1 hasta charset.length - 1
 * Cada resultado incluye un puntaje de probabilidad basado en palabras del español.
 *
 * @param {string} text    - Texto cifrado a analizar
 * @param {string} charset - Conjunto de caracteres usado al cifrar
 * @returns {{ cipher: string, shift: number|null, resultado: string, score: number }[]}
 */
// [23]
function bruteforceAnalyze(text, charset) {
  const results = [];

  // Atbash: unica posibilidad (simetrico, no tiene llave)
  try {
    const resultado = atbashDecrypt(text, charset);
    results.push({ cipher: "Atbash", shift: null, resultado, score: scoreText(resultado) });
  } catch (_) {}

  // Cesar: probar cada desplazamiento posible dentro del charset
  const len = charset.length;
  for (let shift = 1; shift < len; shift++) {
    try {
      const resultado = caesarDecrypt(text, charset, shift);
      results.push({ cipher: "César", shift, resultado, score: scoreText(resultado) });
    } catch (_) {}
  }

  return results;
}
