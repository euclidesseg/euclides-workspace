import { setBlockType } from "prosemirror-commands";
import { Schema } from "prosemirror-model";

  export const turnIntoCodeBlock = (schema: Schema) => {
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