


// EditorState → Guarda TODO el estado del editor (documento, selección, plugins)
// EditorView → Es el editor visual que se renderiza en el DOM
// Schema → Define qué tipos de nodos y marcas existen (párrafo, heading, bold, etc.)
// DOMParser → Convierte HTML → documento interno de ProseMirror
// schema-basic → Esquema base (párrafos, headings, bold, italic…)
// addListNodes → Agrega listas (ul, ol, li) al schema
// exampleSetup → Instala plugins de DEMO (menú, teclas, history, atajos, etc.)


/*
EL SCHEMA ES EL "DICCIONARIO" DEL EDITOR 📚

Aquí se define el lenguaje que el editor entiende.

Dentro del schema existen dos cosas principales:

1️⃣ NODES (nodos) → Son los BLOQUES o estructuras del documento
2️⃣ MARKS (marcas) → Son formatos que se aplican al TEXTO dentro de un bloque


━━━━━━━━━━━━━━━━━━
🧱 NODES = MODIFICAN BLOQUES COMPLETOS
━━━━━━━━━━━━━━━━━━

Un nodo es como una "caja" que contiene texto u otros nodos.

Ejemplos de bloques:
<p>      párrafo
<h1>     título
<ul>     lista
<li>     elemento de lista
<blockquote> cita
<pre>    code block

Si quieres modificar TODO el bloque, se hace como atributo del nodo.

Ejemplo:
Alineación, fondo, margen, sangría, etc.

<p style="text-align:center">Hola mundo</p>

Eso vive en:
nodes → paragraph.attrs


━━━━━━━━━━━━━━━━━━
✏️ MARKS = MODIFICAN TEXTO DENTRO DEL BLOQUE
━━━━━━━━━━━━━━━━━━

Las marks NO cambian la estructura,
solo envuelven partes del texto.

Ejemplo:

<p>Hola <s>mundo</s></p>

Aquí el bloque es el párrafo,
pero "mundo" tiene una MARK.

Ejemplos de marks:
<strong>   bold
<em>       italic
<a>        link
<code>     code inline
<s>        strike (NO viene por defecto)

Eso vive en:
marks → schema.spec.marks


━━━━━━━━━━━━━━━━━━
📦 LO QUE TRAE prosemirror-schema-basic
━━━━━━━━━━━━━━━━━━

NODES incluidos:
✔ doc
✔ paragraph <p>
✔ heading <h1-h6>
✔ blockquote
✔ horizontal_rule <hr>
✔ code_block <pre>
✔ image
✔ hard_break <br>
✔ text

MARKS incluidos:
✔ strong (bold)
✔ em (italic)
✔ link
✔ code (inline code)

━━━━━━━━━━━━━━━━━━
🚫 COSAS QUE NO VIENEN Y DEBES AGREGAR TÚ
━━━━━━━━━━━━━━━━━━

🎨 MARKS (modifican TEXTO dentro de un bloque)

❌ strike / tachado → <s>texto</s>
❌ underline / subrayado → <u>texto</u>
❌ color de texto → letras rojas, azules, etc.
❌ background / highlight → fondo de palabras
❌ fontSize → tamaño de letra
❌ fontFamily → tipo de fuente


🧱 NODES (modifican BLOQUES o crean estructura)

❌ textAlign → alineación del párrafo (izq, centro, der)
❌ tablas → table, row, cell, header
❌ video embed → <iframe>, <video>
❌ menciones (@usuario) → nodo inline especial
❌ custom blocks → warning, info, success, quote box
❌ cards / embeds → previews de links tipo Notion
❌ columnas / layouts → bloques en columnas
❌ checklist → lista con checkboxes

━━━━━━━━━━━━━━━━━━
Regla de oro:
Si modifica letras → MARK
Si modifica estructura → NODE
━━━━━━━━━━━━━━━━━━


/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🧠 CÓMO AGREGAR COSAS NUEVAS AL EDITOR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

El schema es el "diccionario" del editor.
Dentro de él definimos:

• nodes  → estructuras y bloques
• marks  → estilos que afectan texto dentro de un bloque


━━━━━━━━━━━━━━━━━━
🎨 AGREGAR UN MARK (estilo de texto)
━━━━━━━━━━━━━━━━━━
Los MARKS modifican palabras o partes del texto.

Ejemplos:
bold, italic, strike, color, background, underline

1️⃣ Definir el mark
const strike = {
  parseDOM: [
    { tag: "s" },
    { tag: "del" },
    { style: "text-decoration=line-through" }
  ],
  toDOM() { return ["s", 0]; }
};

2️⃣ Agregarlo al schema
marks: schema.spec.marks.addToEnd("strike", strike)

3️⃣ Usarlo
toggleMark(mySchema.marks.strike)(view.state, view.dispatch);


━━━━━━━━━━━━━━━━━━
🧱 AGREGAR UN NODE (bloque o estructura)
━━━━━━━━━━━━━━━━━━
Los NODES crean bloques completos o nuevas estructuras.

Ejemplos:
párrafos, headings, tablas, videos, bloques info, menciones

1️⃣ Definir el node
const warningBlock = {
  group: "block",
  content: "inline*",
  parseDOM: [{ tag: "div.warning" }],
  toDOM() { return ["div", { class: "warning" }, 0]; }
};

2️⃣ Agregarlo
let nodes = schema.spec.nodes.addToEnd("warning_block", warningBlock);

3️⃣ Crear el schema
new Schema({ nodes, marks })

4️⃣ Usarlo
setBlockType(mySchema.nodes.warning_block)(view.state, view.dispatch);

*/
