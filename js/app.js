
// ─── Charset por defecto ──────────────────────────────────────────────────────
const DEFAULT_CHARSET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 !\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

// ─── Estado de la aplicacion ──────────────────────────────────────────────────
const state = {
  cipher: "caesar",   // Cifrado activo: "caesar" | "atbash"
  lastAction: null,   // Última accion ejecutada: "encriptar" | "desencriptar"
};

// ─── Referencias al DOM ───────────────────────────────────────────────────────
const elements = {
  tabs:          document.querySelectorAll(".boton-tab"),
  shiftGroup:    document.getElementById("shift-group"),
  shiftInput:    document.getElementById("shift"),
  charsetInput:  document.getElementById("charset"),
  resetCharset:  document.getElementById("reset-charset"),
  toggleCharset: document.getElementById("toggle-charset"),
  charsetBox:    document.getElementById("charset-box"),
  inputText:     document.getElementById("input-text"),
  clearInput:    document.getElementById("clear-input"),
  encryptBtn:    document.getElementById("encrypt-btn"),
  decryptBtn:    document.getElementById("decrypt-btn"),
  swapBtn:       document.getElementById("swap-btn"),
  outputText:    document.getElementById("output-text"),
  copyOutput:    document.getElementById("copy-output"),
  cipherBadge:    document.getElementById("cipher-badge"),
  toast:          document.getElementById("toast"),
  charCount:      document.getElementById("char-count"),
  asciiSection:   document.getElementById("ascii-section"),
  asciiTableBody: document.getElementById("ascii-table-body"),
  asciiMeta:      document.getElementById("ascii-meta"),
  seccionIo:           document.getElementById("seccion-io"),
  seccionFuerza:       document.getElementById("seccion-fuerza"),
  bfInput:             document.getElementById("bf-input"),
  bfAnalizar:          document.getElementById("bf-analizar"),
  bfLista:             document.getElementById("bf-lista"),
  bfTotal:             document.getElementById("bf-total"),
  seccionResultadosBf: document.getElementById("seccion-resultados-bf"),
};

// ─── Inicializacion ───────────────────────────────────────────────────────────
// [8]
function init() {
  elements.charsetInput.value = DEFAULT_CHARSET;
  updateBadge();
  registerEvents();
}

// ─── Registro de eventos ───────────────────────────────────────────────────────

// [9]
function registerEvents() {
  // Cambio de cipher mediante las pestañas
  elements.tabs.forEach((tab) => {
    tab.addEventListener("click", () => handleTabChange(tab.dataset.cipher));
  });

  // Botones de accion principal
  elements.encryptBtn.addEventListener("click", () => handleProcess("encrypt"));
  elements.decryptBtn.addEventListener("click", () => handleProcess("decrypt"));

  // Intercambiar entrada/salida
  elements.swapBtn.addEventListener("click", handleSwap);

  // Controles del charset
  elements.resetCharset.addEventListener("click", handleResetCharset);
  elements.toggleCharset.addEventListener("click", handleToggleCharset);

  // Limpiar entrada
  elements.clearInput.addEventListener("click", handleClearInput);

  // Copiar resultado
  elements.copyOutput.addEventListener("click", handleCopyOutput);

  // Contador de caracteres en tiempo real
  elements.inputText.addEventListener("input", updateCharCount);

  // Actualizar badge cuando cambia el shift
  elements.shiftInput.addEventListener("input", updateBadge);

  // Boton de analisis por fuerza bruta
  elements.bfAnalizar.addEventListener("click", handleBruteforce);
}

// ─── Manejadores de eventos ───────────────────────────────────────────────────

/**
 * @param {string} cipher - "caesar" o "atbash"
 */
// [10]
function handleTabChange(cipher) {
  state.cipher = cipher;

  elements.tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.cipher === cipher);
  });

  const esFuerza = cipher === "bruteforce";

  // Alternar entre la seccion normal y la de fuerza bruta
  elements.seccionIo.classList.toggle("hidden", esFuerza);
  elements.seccionFuerza.classList.toggle("hidden", !esFuerza);
  elements.asciiSection.classList.add("hidden");

  // Desplazamiento solo aplica a Cesar
  elements.shiftGroup.classList.toggle("hidden", cipher !== "caesar");

  if (!esFuerza) {
    updateBadge();
    if (elements.outputText.value && state.lastAction) {
      handleProcess(state.lastAction);
    }
  }
}

/**
 * hace el cifrado o descifrado segun la acción
 * Valida los inputs antes de procesar y muestra errores si los hay
 *
 * @param {"encrypt"|"decrypt"} action - Accion a ejecutar
 */
// [11]
function handleProcess(action) {
  const text    = elements.inputText.value;
  const charset = elements.charsetInput.value;
  const shift   = parseInt(elements.shiftInput.value, 10);

  // Validaciones
  if (!text.trim()) {
    showToast("Escribe un texto antes de procesar.", "error");
    elements.inputText.focus();
    return;
  }
  if (charset.length < 2) {
    showToast("El conjunto de caracteres debe tener al menos 2 caracteres.", "error");
    return;
  }
  if (state.cipher === "caesar" && (isNaN(shift) || shift < 1)) {
    showToast("El desplazamiento debe ser un número entero mayor a 0.", "error");
    elements.shiftInput.focus();
    return;
  }

  let result = "";

  try {
    if (state.cipher === "caesar") {
      result =
        action === "encrypt"
          ? caesarEncrypt(text, charset, shift)
          : caesarDecrypt(text, charset, shift);
    } else {
      result =
        action === "encrypt"
          ? atbashEncrypt(text, charset)
          : atbashDecrypt(text, charset);
    }

    elements.outputText.value = result;
    state.lastAction = action;

    // Genera la tabla de conversión ASCII caracter por caracter
    buildAsciiTable(text, result, charset);

    //  visual en el boton presionado
    const btn = action === "encrypt" ? elements.encryptBtn : elements.decryptBtn;
    flashButton(btn);

    showToast(
      action === "encrypt" ? "Texto cifrado correctamente." : "Texto descifrado correctamente.",
      "success"
    );
  } catch (err) {
    showToast(err.message, "error");
  }
}

/**
 * Intercambia el contenido del area de entrada con el de salida
 */
// [12]
function handleSwap() {
  const temp = elements.inputText.value;
  elements.inputText.value = elements.outputText.value;
  elements.outputText.value = temp;
  updateCharCount();

  if (!elements.inputText.value) return;
  showToast("Textos intercambiados.", "info");
}

/**
 * Restaura el charset a su valor por defecto
 */
// [13]
function handleResetCharset() {
  elements.charsetInput.value = DEFAULT_CHARSET;
  showToast("Charset restablecido al valor por defecto.", "info");
}

/**
 * Alterna la visibilidad del panel de configuración del charset
 */
// [14]
function handleToggleCharset() {
  const box = elements.charsetBox;
  const isHidden = box.classList.toggle("hidden");
  elements.toggleCharset.textContent = isHidden ? "Configurar charset ▼" : "Ocultar charset ▲";
}

/**
 * Limpia el area de entrada y reinicia el contador de caracteresa
 */
// [15]
function handleClearInput() {
  elements.inputText.value = "";
  elements.outputText.value = "";
  elements.asciiSection.classList.add("hidden");
  elements.asciiTableBody.innerHTML = "";
  updateCharCount();
  elements.inputText.focus();
}

/**
 * Copia el texto cifrado/descifrado al portapapeles del usuario
 */
// [16]
function handleCopyOutput() {
  const text = elements.outputText.value;
  if (!text) {
    showToast("No hay nada que copiar.", "error");
    return;
  }
  navigator.clipboard.writeText(text).then(() => {
    showToast("Copiado al portapapeles.", "success");
    flashButton(elements.copyOutput);
  });
}

// ─── Utilidades de UI ─────────────────────────────────────────────────────────

// [17]
function updateBadge() {
  if (state.cipher === "caesar") {
    const shift = elements.shiftInput.value || "?";
    elements.cipherBadge.textContent = `César · Desplazamiento: ${shift}`;
  } else {
    elements.cipherBadge.textContent = "Atbash · Simétrico";
  }
}

/**
 * Actualiza el contador de caracteres del area de entrada
 */
// [18]
function updateCharCount() {
  const len = elements.inputText.value.length;
  elements.charCount.textContent = `${len} carácter${len !== 1 ? "es" : ""}`;
}

/**
 * Muestra un mensaje de notificacio en la pantalla
 *
 * @param {string} message          - Mensaje a mostrar
 * @param {"success"|"error"|"info"} type - Tipo de notificacion
 */
// [19]
function showToast(message, type = "info") {
  const toast = elements.toast;
  toast.textContent = message;
  toast.className = `aviso aviso--${type} aviso--visible`;

  // Oculta el aviso 3 segundos
  setTimeout(() => {
    toast.classList.remove("aviso--visible");
  }, 3000);
}

/**
 * Aplica una animacion
 * @param {HTMLElement} btn - Boton a animar.
 */
// [20]
function flashButton(btn) {
  btn.classList.add("boton--activo");
  btn.addEventListener("animationend", () => btn.classList.remove("boton--activo"), { once: true });
}

// ─── Fuerza Bruta ─────────────────────────────────────────────────────────────

/**
 * Valida la entrada y lanza el analisis por fuerza bruta.
 * Muestra un toast con el total de combinaciones probadas.
 */
// [24]
function handleBruteforce() {
  const text    = elements.bfInput.value;
  const charset = elements.charsetInput.value;

  if (!text.trim()) {
    showToast("Pega un texto cifrado antes de analizar.", "error");
    elements.bfInput.focus();
    return;
  }
  if (charset.length < 2) {
    showToast("El conjunto de caracteres debe tener al menos 2 caracteres.", "error");
    return;
  }

  const results = bruteforceAnalyze(text, charset);
  buildBruteforceResults(results);
  showToast(`${results.length} combinaciones analizadas.`, "success");
}

/**
 * Genera la lista visual con todos los resultados del analisis.
 * Cada fila muestra la etiqueta del cifrado, el texto descifrado y un boton
 * para copiar ese resultado especifico al portapapeles.
 *
 * @param {{ cipher: string, shift: number|null, resultado: string }[]} results
 */
// [25]
function buildBruteforceResults(results) {
  const lista = elements.bfLista;
  lista.innerHTML = "";

  results.forEach(({ cipher, shift, resultado }) => {
    const esAtbash   = cipher === "Atbash";
    const labelClass = esAtbash ? "resultado-etiqueta--atbash" : "resultado-etiqueta--cesar";
    const labelText  = esAtbash ? "Atbash" : `+${shift}`;

    const item = document.createElement("div");
    item.className = "resultado-item";

    const etiqueta = document.createElement("span");
    etiqueta.className = `resultado-etiqueta ${labelClass}`;
    etiqueta.textContent = labelText;

    const texto = document.createElement("span");
    texto.className = "resultado-texto";
    texto.title = resultado;      // texto completo al pasar el cursor
    texto.textContent = resultado;

    const copiarBtn = document.createElement("button");
    copiarBtn.className = "boton boton--chico boton--simple";
    copiarBtn.title = "Copiar";
    copiarBtn.textContent = "⧉";
    copiarBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(resultado).then(() => {
        showToast(`Copiado (${labelText}).`, "success");
        flashButton(copiarBtn);
      });
    });

    item.append(etiqueta, texto, copiarBtn);
    lista.appendChild(item);
  });

  elements.bfTotal.textContent =
    `${results.length} combinación${results.length !== 1 ? "es" : ""}`;
  elements.seccionResultadosBf.classList.remove("hidden");
}

// ─── Tabla de conversion ASCII ────────────────────────────────────────────────

/**
 * @param {string} inputText  - Texto original 
 * @param {string} outputText - Texto procesado 
 * @param {string} charset    - Conjunto de caracteres usado en el cifrado
 */
// [21]
function buildAsciiTable(inputText, outputText, charset) {
  const MAX_ROWS = 80;
  const tbody = elements.asciiTableBody;

  // Limpia filas anteriores antes de generar las nuevas
  tbody.innerHTML = "";

  const inChars  = [...inputText];
  const outChars = [...outputText];
  const total    = inChars.length;
  const shown    = Math.min(total, MAX_ROWS);

  for (let i = 0; i < shown; i++) {
    const inChar  = inChars[i];
    const outChar = outChars[i] ?? "";

    // Código ASCII decimal de cada cara
    const inCode  = inChar.charCodeAt(0);
    const outCode = outChar.charCodeAt(0);

    // Indica si el caracter forma parte del charset configurado
    const inCharset = charset.indexOf(inChar) !== -1;

    const row = document.createElement("tr");
    if (!inCharset) {
      // Caracter fuera del charset: se muestra atenuado y sin flecha de cambio
      row.classList.add("fila-igual");
    }

    row.innerHTML = `
      <td class="celda-letra">${displayChar(inChar)}</td>
      <td class="celda-codigo">${inCode}</td>
      <td class="celda-flecha">${inCharset ? "→" : "·"}</td>
      <td class="celda-letra celda-resultado">${displayChar(outChar)}</td>
      <td class="celda-codigo">${outCode}</td>
    `;

    tbody.appendChild(row);
  }

  // Actualiza el meta-texto con el conteo de caracteres mostrados
  elements.asciiMeta.textContent =
    total > MAX_ROWS
      ? `Mostrando ${shown} de ${total} caracteres`
      : `${total} carácter${total !== 1 ? "es" : ""}`;

  elements.asciiSection.classList.remove("hidden");
}

/**
 * @param {string} char - Caracter a representar
 * @returns {string} HTML con el caracter o su etiqueta descriptiva
 */
// [22]
function displayChar(char) {
  if (char === " ")  return '<span class="etiqueta-especial">SPC</span>';
  if (char === "\n") return '<span class="etiqueta-especial">\\n</span>';
  if (char === "\t") return '<span class="etiqueta-especial">\\t</span>';
  return char;
}

// ─── Arranque ─────────────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", init);
