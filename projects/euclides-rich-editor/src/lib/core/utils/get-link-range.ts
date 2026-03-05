import { EditorState } from "prosemirror-state";

/**
 * Obtiene el rango completo de un enlace (link mark)
 * cuando el cursor está dentro de él.
 *
 * Devuelve:
 * {
 *   start: número donde inicia el enlace
 *   end: número donde termina el enlace
 *   link: instancia del mark de link
 * }
 *
 * Si el cursor no está dentro de un enlace → retorna null.
 */

export function getLinkRange(state:EditorState) {
  // resolvedPos representa la posición actual del cursor en el documento
  // Es un objeto "ResolvedPos" que permite navegar por el árbol del documento
  const resolvedPos = state.selection.$from;

  // Buscamos si en la posición actual existe un mark de tipo "link"
  const link = resolvedPos.marks().find(m => m.type === state.schema.marks['link']);

   // Si no hay enlace en la posición actual, salimos
  if (!link) return null;

  // Posición inicial donde está el cursor
  let start = resolvedPos.pos;
  let end = resolvedPos.pos;

  
   /**
   * ⬅️ Expandir hacia la izquierda
   *
   * Retrocedemos carácter por carácter mientras
   * sigamos encontrando el mismo mark de link.
   *
   * Cuando encontramos texto sin ese mark,
   * significa que el enlace comenzó antes.
   */
  while (start > 0) {
    const marks = state.doc.resolve(start - 1).marks();
    if (!marks.some(m => m.type === link.type)) break;
    start--;
  }

  /**
   * ➡️ Expandir hacia la derecha
   *
   * Avanzamos carácter por carácter mientras
   * el texto tenga el mismo mark de link.
   */
  while (end < state.doc.content.size) {
    const marks = state.doc.resolve(end).marks();
    if (!marks.some(m => m.type === link.type)) break;
    end++;
  }

  return { start, end, link };
}