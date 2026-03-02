import { setBlockType } from "prosemirror-commands";
import { NodeType, Schema } from "prosemirror-model";
import { Command, EditorState } from "prosemirror-state";
import { list } from "../../core/types/list.type";
import { liftListItem, wrapInList } from "prosemirror-schema-list";


export class CommandsMethods {
    static turnIntoCodeBlock(schema: Schema) {
        return (state: any, dispatch: any): boolean => {
            const { selection, tr } = state;
            const { $from } = selection;

            // Buscar si estamos dentro de una lista
            for (let d = $from.depth; d > 0; d--) {
                const node = $from.node(d);

                if (
                    node.type === schema.nodes['bullet_list'] ||
                    node.type === schema.nodes['ordered_list']
                ) {
                    //  Extraer texto de todos los li
                    let text = "";

                    node.forEach((listItem: any) => {
                        const para = listItem.firstChild;
                        if (para) {
                            text += para.textContent + "\n";
                        }
                    });

                    text = text.trimEnd();

                    const codeBlock = schema.nodes['code_block'].create(
                        null,
                        schema.text(text)
                    );

                    if (dispatch) {
                        dispatch(
                            tr.replaceWith(
                                $from.before(d),
                                $from.after(d),
                                codeBlock
                            )
                        );
                    }

                    return true;
                }
            }

            // 📌 No estaba en lista → comportamiento normal
            return setBlockType(schema.nodes['code_block'])
                (state, dispatch);
        };
    }

  
    static switchList(listType: NodeType): Command {
        return (state, dispatch) => {
            const { schema, selection } = state;
            const { $from, from, to } = selection;

            let tr = state.tr;

            if ($from.parent.type === schema.nodes['heading']) {
                tr = tr.setBlockType(from, to, schema.nodes['paragraph']);
            }

            const resolved = tr.doc.resolve(tr.selection.from);
            for (let d = resolved.depth; d > 0; d--) {
                const node = resolved.node(d);

                if (
                    node.type === schema.nodes['bullet_list'] ||
                    node.type === schema.nodes['ordered_list']
                ) {
                    if (node.type === listType) {
                        return liftListItem(schema.nodes['list_item'])(state, dispatch);
                    }

                    if (dispatch) {
                        dispatch(tr.setNodeMarkup(resolved.before(d), listType));
                    }
                    return true;
                }
            }

            return wrapInList(listType)(state, dispatch);
        };
    }

}
