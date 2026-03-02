import { NodeSpec, Schema } from 'prosemirror-model';
import { schema as basicSchema, schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import type {MarkSpec, Node} from 'prosemirror-model'


// El schema es el diccionario + reglas gramaticales del editor.
// el shcema define que nodos existen (paragraph, heading, list, code_block, etc.)
// Qué marcas existen (bold, italic, link, etc.)
const paragraph:NodeSpec = {
  ...schema.spec.nodes.get('paragraph'),// tomamos configuracion original del node paragraph
  attrs:{
      // Agregamos un nuevo atributo llamado textAlign
    textAlign:{default:'left'}
  },
  //Convierte HTML en documento prosemirror
  parseDOM:[
    {
      // Esta regla se activa cuando encuentra un <p> en el DOM
      tag:"p",
      getAttrs:(dom:HTMLElement) => ({
        textAlign:dom.style.textAlign || "left"
      })
    }
  ],
  // convierte documento procemirror en HTML
  toDOM(node:Node){
    return[
      "p",
      {style:`text-align:${node.attrs['textAlign']}`},
      0
    ]
  }
}

// creamos el mark strike (tachado)
const strike:MarkSpec = {
  parseDOM: [
    { tag: "s" },
    { tag: "del" },
    { style: "text-decoration=line-through" }
  ],
  toDOM() {
    return ["s", 0];
  }
};
const nodes = basicSchema.spec.nodes.update("paragraph", paragraph);

export const EuclidesEditorSchema = new Schema({
  nodes: addListNodes(nodes, "paragraph block*", "block"),
  marks: basicSchema.spec.marks.addToEnd("strike", strike),
});
