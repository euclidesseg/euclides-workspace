import { EditorView } from "prosemirror-view";
import { getLinkRange } from "../../../core/utils/get-link-range";
import { normalizeUrl } from "./normalize-url";

/**
 * Aplica un enlace en el editor.
 * 
 * Comportamiento:
 * 1. Si el cursor está dentro de un enlace existente → lo actualiza.
 * 2. Si NO hay enlace → inserta el texto del enlace y le aplica el mark.
 * 
 * @param url  URL ingresada por el usuario
 * @param view Instancia visual del editor de ProseMirror
 * @returns boolean indicando si la operación se ejecutó
 */

export const applyLink = (url: string, view: EditorView): boolean => {
  // EditorView contiene el estado actual del documento y el dispatcher
  const { state, dispatch } = view;

  // Busca si la selección actual está dentro de un link
  // Devuelve algo como:
  // { start, end, link }
  // donde start/end son los límites del enlace en el documento
  const linkInfo = getLinkRange(state);

  const href = normalizeUrl(url);

  // Obtenemos el tipo de mark "link" desde el schema del editor
  // Los marks son estilos inline como:
  // bold, italic, link, etc.
  const linkMark = state.schema.marks['link'];

  // Si el schema no tiene definido el mark link, no podemos continuar
  if (!linkMark) return false

  /**
  * CASO 1
  * --------------------------------
  * El cursor ya está dentro de un enlace existente
  * 
  * En este caso NO insertamos texto nuevo,
  * solo modificamos el enlace existente.
  */
  if (linkInfo) {
    // extraemos los límites del enlace
    const { start, end, link } = linkInfo;

    // Creamos una transacción (tr) que:
    // 1. elimina el mark actual
    // 2. agrega uno nuevo con el href actualizado
    dispatch(
      state.tr.removeMark(start, end, linkMark).addMark(start, end, linkMark.create({
        href, title: link.attrs['title']
      }))
    );
    return true
  }

   /**
   * CASO 2
   * --------------------------------
   * No hay enlace en la selección actual
   * 
   * Entonces insertamos el texto del enlace
   * y luego aplicamos el mark de link.
   */


  // posición actual del cursor
  const from = state.selection.from;

  // insertamos el texto del enlace en el documento
  const tr = state.tr.insertText(href, from);

  // aplicamos el mark "link" al texto recién insertado
  tr.addMark(from, from + href.length, linkMark.create({
    href,
    title: href
  }))
  // enviamos la transacción al editor para actualizar el documento
  dispatch(tr);
  return true;

}