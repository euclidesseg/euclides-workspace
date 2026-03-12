import { TextSelection } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

export const insertImage = (view: EditorView, src: string) => {
    const { state, dispatch } = view;
    const { schema, selection } = state;

    const imageNode = schema.nodes['image'].create({ src: src });
    const paragraphNode = schema.nodes['paragraph'].create();

    const tr = state.tr;

    tr.replaceSelectionWith(imageNode);

    // Posición despues de la imagen insertada
    const postAfterImage = tr.selection.from;

    // insertar parrafo debajo
    tr.insert(postAfterImage, paragraphNode);
    tr.setSelection(TextSelection.create(tr.doc, postAfterImage + 1))

    dispatch(tr.scrollIntoView());

    return true;
}