import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { EuclidesEditorSchema } from "./schema/euclides-schema";
import { EditorStateService } from "../core/editor-state.service";
import { buildPlugins } from "./plugins/euclides-plugins";

export class EditorEngine{


    static create(element:HTMLElement, stateService:EditorStateService): EditorView{
        
        const state = EditorState.create({
            schema:EuclidesEditorSchema,
            plugins: buildPlugins(stateService)

        })
        return new EditorView(element,{
            state,
            attributes:{class: 'euclides-editor'}
        })
    }

}