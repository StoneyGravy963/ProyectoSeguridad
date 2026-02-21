

/**
 * Valida que los parametros de entrada sean correctos antes de cifrar/descifrar
 * @param {string} text    - Texto a procesar
 * @param {string} charset - Conjunto de caracteres validos
 * @param {number} shift   - Número de posiciones a desplazar
 * @throws {Error} Si algun parámetro no es valido
 */
// [1]
function validateCaesarParams(text, charset, shift) {
  if (typeof text !== "string" || text.trim() === "") {
    throw new Error("El texto de entrada no puede estar vacío");
  }
  if (typeof charset !== "string" || charset.length < 2) {
    throw new Error("El conjunto de caracteres debe tener al menos 2 caracteres");
  }
  if (!Number.isInteger(shift)) {
    throw new Error("El desplazamiento debe ser un número entero");
  }
}

/**
 * Cifra un texto usando el Cifrado Cesar

 * @param {string} text    - Texto plano a cifrar
 * @param {string} charset - Conjunto de caracteres a usar como alfabeto
 * @param {number} shift   - Número de posiciones a desplazar hacia adelante
 * @returns {string} Texto cifrado
 */
// [2]
function caesarEncrypt(text, charset, shift) {
  validateCaesarParams(text, charset, shift);

  const len = charset.length;
  // Normaliza el shift para que siempre sea positivo
  const normalizedShift = ((shift % len) + len) % len;

  return text
    .split("")
    .map((char) => {
      const index = charset.indexOf(char);
      if (index === -1) {
        // El caracter no está en el charset
        return char;
      }
      // Aplica el desplazamiento con modulo para que sea circular
      const newIndex = (index + normalizedShift) % len;
      return charset[newIndex];
    })
    .join("");
}

/**
 * Descifra un texto codificado con el Cifrado Cesar]
 * 
 * @param {string} text    - Texto cifrado a descifrar
 * @param {string} charset - Conjunto de caracteres usado durante el cifrado
 * @param {number} shift   - El mismo desplazamiento usado al cifrar
 * @returns {string} Texto descifrado
 */
// [3]
function caesarDecrypt(text, charset, shift) {
  validateCaesarParams(text, charset, shift);

  const len = charset.length;
  const normalizedShift = ((shift % len) + len) % len;

  return text
    .split("")
    .map((char) => {
      const index = charset.indexOf(char);
      if (index === -1) {
        return char;
      }
      // Desplazamiento inverso restar shift 
      const newIndex = ((index - normalizedShift) + len) % len;
      return charset[newIndex];
    })
    .join("");
}
