import { Injectable } from "@angular/core";
import { EditorView } from "prosemirror-view";
import OrderedMap from "orderedmap";
import { MarkSpec, NodeSpec, Schema } from "prosemirror-model";

import { setBlockType, toggleMark } from "prosemirror-commands";
import { EuclidesEditorSchema } from "../engine/schema/euclides-schema";
import { CommandsMethods } from "../engine/commanmethods/command.methods";
import { Command } from "prosemirror-state";
@Injectable(
    { providedIn: 'root' },
)
export class EditorCommandsService {

    // type Command = (
    //   state: EditorState, // estado actual del editor (documento + selección)
    //   dispatch?: (tr: Transaction) => void, // función para aplicar una transacción
    //   view?: EditorView // instancia visual del editor (acceso al DOM)
    // ) => boolean; // retorna true si el comando se ejecutó
    toggleBold(view: EditorView):boolean {
        const command:Command =  toggleMark(EuclidesEditorSchema.marks['strong'])
        return  command(view.state, view.dispatch)  
    }

    toggleItailc(view: EditorView):boolean {
        const command:Command =  toggleMark(EuclidesEditorSchema.marks['em'])
        return  command(view.state, view.dispatch)  
    }

    setTextAlign(align: string, view:EditorView):boolean {
        return setBlockType(EuclidesEditorSchema.nodes['paragraph'], { textAlign: align })(view.state, view.dispatch);
    }

    toggleCodeBlock(view:EditorView):boolean{
       return  CommandsMethods.turnIntoCodeBlock(EuclidesEditorSchema)(view.state, view.dispatch);
    }

    
}