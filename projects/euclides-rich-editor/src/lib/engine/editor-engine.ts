import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { EuclidesEditorSchema } from "./schema/euclides-schema";
import { EditorStateService } from "../core/services/editor-state.service";
import { buildPlugins } from "./plugins/euclides-plugins";
import { ImageNodeView } from "./nodeviews/image/image.nodeview";

export class EditorEngine{

    /* Esta funcion crea y devuelve el editor listo para usarse
         * El estado contiene:
         * - El documento actual
         * - La posición del cursor
         * - La selección
         * - El historial (undo/redo)
         * - La información interna necesaria para que ProseMirror funcione

    */
    static create(element:HTMLElement, stateService:EditorStateService): EditorView{
        
        const state = EditorState.create({
            /*El Schema establece las reglas del documento*/
            schema:EuclidesEditorSchema,

            /* 
             *Los plugins extienden el comportamiento del editor:
             * - Atajos de teclado
             * - Historial
             * - Lógica personalizada
             * - Sincronización con el EditorStateService (Angular)
            */
            plugins: buildPlugins(stateService)

        })
        return new EditorView(element,{
            state,
            nodeViews:{
                image:(node,view,getPos) => new ImageNodeView(node, view,getPos)
                
            },
            attributes:{class: 'euclides-editor'}
        })
    }

}