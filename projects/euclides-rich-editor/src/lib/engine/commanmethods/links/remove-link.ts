import { EditorView } from "prosemirror-view";
import { getLinkRange } from "../../../core/utils/get-link-range";

export const removeLink = (view: EditorView): boolean => {
  const { state, dispatch } = view;
  const linkMark = state.schema.marks["link"];

  const { from, to, empty } = state.selection;

  // si hay texto seleccionado
  if (!empty) {
    dispatch(state.tr.removeMark(from, to, linkMark));
    return true;
  }

  // si solo hay cursor
  const linkInfo = getLinkRange(state);
  if (!linkInfo) return false;

  dispatch(
    state.tr.removeMark(linkInfo.start, linkInfo.end, linkMark)
  );

  return true;
};