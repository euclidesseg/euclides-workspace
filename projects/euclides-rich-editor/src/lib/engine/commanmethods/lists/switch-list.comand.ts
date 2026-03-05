import { NodeType } from "prosemirror-model";
import { liftListItem, wrapInList } from "prosemirror-schema-list";
import { Command } from "prosemirror-state";

 export const  switchList = (listType: NodeType): Command => {
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