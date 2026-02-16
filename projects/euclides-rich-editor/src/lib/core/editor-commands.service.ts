import { Injectable } from "@angular/core";

import { toggleMark } from "prosemirror-commands";
import { EuclidesEditorSchema } from "../engine/schema/euclides-schema";
import { EditorView } from "prosemirror-view";
@Injectable(
    {providedIn:'root'},
)
export class EditorCommandsService{

    toggleBold(view:EditorView){
        return toggleMark(EuclidesEditorSchema.marks['strong'])(view.state, view.dispatch)
    }

}