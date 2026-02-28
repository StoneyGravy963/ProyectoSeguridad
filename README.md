# Cifrado Elias — César & Atbash

Aplicacion web para cifrar y descifrar texto usando los algoritmos **César** y **Atbash**, con soporte para un conjunto de caracteres personalizado definido por el usuario. Cada operacion muestra una tabla de conversión ASCII carácter por carácter.

Construida con HTML, CSS y JavaScript puro, sin dependencias externas.

---

## Estructura del proyecto

```
ProyectoSeguridad1/
├── index.html        — Interfaz de la aplicación
├── css/
│   └── styles.css    — Estilos
└── js/
    ├── caesar.js     — Lógica del Cifrado César
    ├── atbash.js     — Lógica del Cifrado Atbash
    ├── bruteforce.js — Módulo de análisis por fuerza bruta
    └── app.js        — Controlador de la interfaz de usuario
```

---

## Diccionario de funciones

### `caesar.js`

| # | Función | Descripción |
|---|---------|-------------|
| [1] | `validateCaesarParams(text, charset, shift)` | Verifica que el texto no esté vacío, el charset tenga al menos 2 caracteres y el desplazamiento sea un entero. Lanza un error si algo falla. |
| [2] | `caesarEncrypt(text, charset, shift)` | Cifra el texto desplazando cada carácter del charset `shift` posiciones hacia adelante. |
| [3] | `caesarDecrypt(text, charset, shift)` | Descifra aplicando el desplazamiento inverso (`-shift`) para recuperar el texto original. |

### `atbash.js`

| # | Función | Descripción |
|---|---------|-------------|
| [4] | `validateAtbashParams(text, charset)` | Verifica que el texto y el charset sean válidos antes de procesar. |
| [5] | `atbashProcess(text, charset)` | Aplica el mapeo espejo: cada carácter en posición `i` del charset se reemplaza por el que está en posición `longitud - 1 - i`. |
| [6] | `atbashEncrypt(text, charset)` | Alias de `atbashProcess`. Cifra el texto con Atbash. |
| [7] | `atbashDecrypt(text, charset)` | Alias de `atbashProcess`. Como Atbash es simétrico, descifrar es la misma operación que cifrar. |

### `app.js`

| # | Función | Descripción |
|---|---------|-------------|
| [8] | `init()` | Punto de entrada de la app: carga el charset por defecto en el campo de texto y registra todos los eventos. |
| [9] | `registerEvents()` | Asocia cada elemento del DOM (botones, inputs, pestañas) con su función manejadora correspondiente. |
| [10] | `handleTabChange(cipher)` | Cambia el módulo activo (César, Atbash o Fuerza Bruta), muestra u oculta las secciones correspondientes y actualiza el campo de desplazamiento. |
| [11] | `handleProcess(action)` | Valida los inputs y ejecuta el cifrado o descifrado según la acción (`"encrypt"` o `"decrypt"`); después genera la tabla ASCII. |
| [12] | `handleSwap()` | Intercambia el contenido del área de entrada con el de salida para encadenar operaciones fácilmente. |
| [13] | `handleResetCharset()` | Restaura el campo del charset al valor por defecto (ASCII imprimible completo). |
| [14] | `handleToggleCharset()` | Muestra u oculta el panel de configuración del charset y actualiza el texto del botón. |
| [15] | `handleClearInput()` | Limpia las áreas de entrada y salida, oculta la tabla ASCII y devuelve el foco al textarea. |
| [16] | `handleCopyOutput()` | Copia el texto del área de salida al portapapeles del usuario usando la API del navegador. |
| [17] | `updateBadge()` | Actualiza el indicador en la parte inferior de la tarjeta mostrando el cifrado activo y, si es César, el desplazamiento actual. |
| [18] | `updateCharCount()` | Actualiza en tiempo real el contador de caracteres del área de entrada. |
| [19] | `showToast(message, type)` | Muestra una notificación temporal en pantalla con el mensaje y el tipo de estilo indicado (`success`, `error` o `info`). |
| [20] | `flashButton(btn)` | Añade una animación de pulso a un botón para dar retroalimentación visual al usuario tras una acción. |
| [21] | `buildAsciiTable(inputText, outputText, charset)` | Genera la tabla de conversión ASCII fila por fila: muestra el carácter original, su código decimal, el carácter resultado y su código decimal. Limita la visualización a 80 filas. |
| [22] | `displayChar(char)` | Convierte caracteres invisibles (espacio, salto de línea, tabulación) en etiquetas visuales (`SPC`, `\n`, `\t`) para que las celdas de la tabla nunca queden vacías. |

### `bruteforce.js`

| # | Función | Descripción |
|---|---------|-------------|
| [23] | `bruteforceAnalyze(text, charset)` | Prueba todas las combinaciones posibles: Atbash (1 intento) + César con cada desplazamiento de 1 hasta `charset.length - 1`. Devuelve un array con todos los textos descifrados. |

### Fuerza bruta en `app.js`

| # | Función | Descripción |
|---|---------|-------------|
| [24] | `handleBruteforce()` | Valida que haya texto y charset, llama a `bruteforceAnalyze` y muestra los resultados con un toast de confirmación. |
| [25] | `buildBruteforceResults(results)` | Construye la lista visual de resultados: una fila por combinación con su etiqueta (`Atbash` o `+N`), el texto descifrado y un botón para copiar ese resultado concreto. |

---

## Elementos clave del HTML

| ID / Clase | Descripción |
|-----------|-------------|
| `#shift-group` | Panel del desplazamiento; se oculta al cambiar a Atbash. |
| `#charset-box` | Panel expandible donde el usuario edita el charset. |
| `#input-text` | Área de texto de entrada. |
| `#output-text` | Área de texto de salida . |
| `#ascii-section` | Sección de la tabla ASCII; oculta hasta que se procesa un texto. |
| `#ascii-table-body` | `<tbody>` donde se insertan dinámicamente las filas de la tabla. |
| `#cipher-badge` | Indicador de texto en tiempo real con el cifrado y configuración activos. |
| `#toast` | Contenedor del aviso temporal (notificación flotante). |
| `#seccion-fuerza` | Sección completa de fuerza bruta; se muestra al activar esa pestaña. |
| `#bf-input` | Textarea donde se pega el texto cifrado a analizar. |
| `#bf-analizar` | Botón que dispara el análisis de todas las combinaciones. |
| `#seccion-resultados-bf` | Panel de resultados; oculto hasta que se hace el primer análisis. |
| `#bf-lista` | Contenedor donde se insertan dinámicamente las filas de resultados. |
| `#bf-total` | Contador que muestra cuántas combinaciones se probaron. |
