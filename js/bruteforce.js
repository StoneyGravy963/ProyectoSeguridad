/**
 * bruteforce.js
 * Modulo de analisis por fuerza bruta con puntuacion automatica.
 */

// Palabras frecuentes del español usadas para puntuar cada resultado.
// Cuantas mas coincidan con el texto descifrado, mas probable es que sea el correcto.
// [26]
const PALABRAS_ES = [
  "el","la","los","las","lo","un","una","unos","unas",
  "yo","tu","tú","el","él","ella","nos","nosotros","nosotras",
  "ellos","ellas","me","te","se","le","les","mi","mis","tu","tus","su","sus",
  "de","del","al","a","en","con","sin","por","para","sobre","entre",
  "hasta","desde","hacia","contra","durante","mediante","segun","según","tras",
  "y","e","o","u","ni","que","como","si","sí","pero","mas","más",
  "aunque","porque","pues","entonces","tambien","también","ademas","además",
  "mientras","donde","cuando","quien","quién","cual","cuál","cuales","cuáles",
  "esto","eso","esta","este","estos","estas","ese","esa","esos","esas",
  "aqui","aquí","ahi","ahí","alla","allá","aca","acá",

  "es","son","era","eran","fue","fueron","ser","sido","sea","sean",
  "estar","estoy","estas","estás","esta","está","estan","están","estaba","estaban",
  "hay","haber","ha","han","hace","hacer","hacen","hizo","hice",
  "tiene","tienen","tener","tuvo","tuvieron",
  "puede","pueden","poder","debe","deben",
  "dice","decir","dijo","dicen",
  "ver","vio","visto","venir","viene","vino",
  "ir","va","vamos","fui","fueron",


  "hola","gracias","buenas","bueno","buena","dias","días","tardes","noches","favor",
  "mensaje","texto","palabra","palabras","frase",
  "codigo","código","cifrado","descifrado","seguridad","sistema","usuario",
  "clave","llave","archivo","datos","informacion","información",
  "resultado","resultados","analisis","análisis","prueba","intento","intentos",
  "valor","valores","numero","número","numeros","números",


  "muy","bien","mal","menos","todo","toda","todos","todas","nada","algo","cada","casi",
  "solo","sólo","siempre","nunca","ya","aun","aún","antes","despues","después",
  "primero","ultimo","último","mismo","misma","mismos","mismas","otro","otra","otros","otras",
  "tiempo","mundo","persona","personas","casa","dia","día","semana","mes","ano","año",
  "hoy","ayer","manana","mañana","noche","tarde","momento","forma","parte","caso","tema",
  "nivel","proyecto","clase","ejemplo"
];

// Estructura de consulta rapida para mantener el analisis eficiente.
const PALABRAS_ES_SET = new Set(PALABRAS_ES);

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
  return palabras.filter((p) => PALABRAS_ES_SET.has(p)).length;
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
