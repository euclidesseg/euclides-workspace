import { NodeSpec, Schema } from 'prosemirror-model';
import { schema as basicSchema, schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import type {Node} from 'prosemirror-model'


// El schema es el diccionario + reglas gramaticales del editor.
// le dicen al editor que existe, y que html representan
// este contiene nodes y marks
const paragraph:NodeSpec = {
  ...schema.spec.nodes.get('paragraph'),
  attrs:{
    textAlign:{default:'left'}
  },
  parseDOM:[
    {
      tag:"p",
      getAttrs:(dom:HTMLElement) => ({
        textAlign:dom.style.textAlign || "left"
      })
    }
  ],
  toDOM(node:Node){
    return[
      "p",
      {style:`text-align:${node.attrs['textAlign']}`},
      0
    ]
  }
}
const nodes = basicSchema.spec.nodes.update("paragraph", paragraph);

export const EuclidesEditorSchema = new Schema({
  nodes: addListNodes(nodes, "paragraph*", "block"),
  marks: basicSchema.spec.marks,
});

/* 
  * Este editor entiende exactamente lo mismo que prosemirror-schema-basic,
  * pero ahora ese conocimiento es MÍO y lo puedo extender.
*/