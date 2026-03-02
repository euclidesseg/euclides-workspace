import { EditorState } from "prosemirror-state";

export function getLinkRange(state:EditorState) {
  const { $from } = state.selection;
  const link = $from.marks().find(m => m.type === state.schema.marks['link']);
  if (!link) return null;

  let start = $from.pos;
  let end = $from.pos;

  // ⬅️ expandir a la izquierda
  while (start > 0) {
    const marks = state.doc.resolve(start - 1).marks();
    if (!marks.some(m => m.type === link.type)) break;
    start--;
  }

  // ➡️ expandir a la derecha
  while (end < state.doc.content.size) {
    const marks = state.doc.resolve(end).marks();
    if (!marks.some(m => m.type === link.type)) break;
    end++;
  }

  return { start, end, link };
}