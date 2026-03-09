import { Injectable } from "@angular/core";
import { EditorView } from "prosemirror-view";

import { setBlockType, toggleMark } from "prosemirror-commands";
import { EuclidesEditorSchema } from "../engine/schema/euclides-schema";
import { Command } from "prosemirror-state";
import { list } from "./types/list.type";

import { switchList } from "../engine/commanmethods/lists/switch-list.comand";
import { turnIntoCodeBlock } from "../engine/commanmethods/blocks/code-block.command";
import { turnIntoHeading } from "../engine/commanmethods/headers/turn-into-heading";

@Injectable(
    { providedIn: 'root' },
)
export class EditorCommandsService {


    // type Command = (
    //   state: EditorState, // estado actual del editor (documento + selección)
    //   dispatch?: (tr: Transaction) => void, // función para aplicar una transacción
    //   view?: EditorView // instancia visual del editor (acceso al DOM)
    // ) => boolean; // retorna true si el comando se ejecutó

    toggleBold(view: EditorView): boolean {
        const command: Command = toggleMark(EuclidesEditorSchema.marks['strong'])
        return command(view.state, view.dispatch)
    }

    toggleItailc(view: EditorView): boolean {
        const command: Command = toggleMark(EuclidesEditorSchema.marks['em'])
        return command(view.state, view.dispatch)
    }

    setTextAlign(align: string, view: EditorView): boolean {
        return setBlockType(EuclidesEditorSchema.nodes['paragraph'], { textAlign: align })(view.state, view.dispatch);
    }

    toggleStrike(view: EditorView): boolean {
        const command: Command = toggleMark(EuclidesEditorSchema.marks['strike'])
        return command(view.state, view.dispatch)
    }
    
    toggleCodeBlock(view: EditorView): boolean {
        const command:Command = turnIntoCodeBlock();
        return command(view.state, view.dispatch);
    }


    toggleList(type: list, view: EditorView): boolean {
        const command = switchList(EuclidesEditorSchema.nodes[type])
        return command(view.state, view.dispatch);
    }

    toggleHeading(level: number, view: EditorView): boolean {
        const tr = turnIntoHeading(level, view.state);
        if (!tr) return false;
        view.dispatch(tr);
        return true;
    }

}