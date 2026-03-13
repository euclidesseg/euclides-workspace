import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { EuclidesEditorSchema } from "./schema/euclides-schema";
import { EditorStateService } from "../core/services/editor-state.service";
import { buildPlugins } from "./plugins/euclides-plugins";
import { ImageNodeView } from "./nodeviews/image/image.nodeview";
import { DOMSerializer, Node } from "prosemirror-model";
import { EditorContent } from "../core/interfaces/EditorContent.interface";

export class EditorEngine {

    /* Esta funcion crea y devuelve el editor listo para usarse
         * El estado contiene:
         * - El documento actual
         * - La posición del cursor
         * - La selección
         * - El historial (undo/redo)
         * - La información interna necesaria para que ProseMirror funcione

    */
    static create(element: HTMLElement, stateService: EditorStateService): EditorView {

        const state = EditorState.create({
            /*El Schema establece las reglas del documento*/
            schema: EuclidesEditorSchema,

            /* 
             *Los plugins extienden el comportamiento del editor:
             * - Atajos de teclado
             * - Historial
             * - Lógica personalizada
             * - Sincronización con el EditorStateService (Angular)
            */
            plugins: buildPlugins(stateService)

        })
        return new EditorView(element, {
            state,
            nodeViews: {
                image: (node, view, getPos) => new ImageNodeView(node, view, getPos)

            },
            attributes: { class: 'euclides-editor' }
        })
    }

    static getDocumentJSON(view: EditorView) {
        return view.state.doc.toJSON()
    }
    static getAllNodes(view: EditorView) {
        const nodes: { node: Node; pos: number }[] = [];
        view.state.doc.descendants((node, pos) => {
            nodes.push({ node, pos });
        });
        return nodes;
    }

    static getContent(view: EditorView): EditorContent {
        const doc = view.state.doc;

        const json = doc.toJSON();
        const text = doc.textContent;

        const images: string[] = [];
        doc.descendants(node => {
            if (node.type.name === 'image') {
                images.push(node.attrs["src"])
            }
        })
        const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

        const readingTime = Math.ceil(wordCount / 200);
        return {
            json,
            html: this.toHTML(doc),
            text,
            wordCount,
            images,
            readingTime
        }
    }

    static toHTML(doc: Node): string {

        const serializer =
            DOMSerializer.fromSchema(EuclidesEditorSchema);

        const fragment = serializer.serializeFragment(
            doc.content
        );

        const div = document.createElement("div");
        div.appendChild(fragment);

        return div.innerHTML;
    }
}