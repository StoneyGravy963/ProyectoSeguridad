
/**
 * Valida que los parametros de entrada sean correctos antes de procesar
 * @param {string} text    - Texto a procesar
 * @param {string} charset - Conjunto de caracteres validos
 * @throws {Error} Si algun parámetro no es válido
 */
// [4]
function validateAtbashParams(text, charset) {
  if (typeof text !== "string" || text.trim() === "") {
    throw new Error("El texto de entrada no puede estar vacío");
  }
  if (typeof charset !== "string" || charset.length < 2) {
    throw new Error("El conjunto de caracteres debe tener al menos 2 caracteres");
  }
}

/**
 * Procesa un texto con el Cifrado Atbash  
 * @param {string} text    - Texto a cifrar o descifrar
 * @param {string} charset - Conjunto de caracteres a usar como alfabeto
 * @returns {string} Texto procesado
 */
// [5]
function atbashProcess(text, charset) {
  validateAtbashParams(text, charset);

  const len = charset.length;

  return text
    .split("")
    .map((char) => {
      const index = charset.indexOf(char);
      if (index === -1) {
        // El caracter no pertenece al charset
        return char;
      }
      // Mapeo posicion desde el final del charset
      const mirrorIndex = len - 1 - index;
      return charset[mirrorIndex];
    })
    .join("");
}

/**
 * Cifra un texto usando Atbash
 * @param {string} text    - Texto plano a cifrar
 * @param {string} charset - Conjunto de caracteres a usar
 * @returns {string} Texto cifrado
 */
// [6]
function atbashEncrypt(text, charset) {
  return atbashProcess(text, charset);
}

/**
 * Descifra un texto codificado con Atbash
 * @param {string} text    - Texto cifrado a descifrar
 * @param {string} charset - Conjunto de caracteres usado durante el cifrado
 * @returns {string} Texto plano original
 */
// [7]
function atbashDecrypt(text, charset) {
  return atbashProcess(text, charset);
}
