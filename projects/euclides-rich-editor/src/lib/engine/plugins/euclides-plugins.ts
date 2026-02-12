import { keymap } from 'prosemirror-keymap';
import { baseKeymap, setBlockType, toggleMark } from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { EuclidesEditorSchema } from '../schema/euclides-schema';
import { buildEuclidesKeymap } from './euclides-keymap';

/*
  Un plugin es una pieza que le agrega comportamiento al editor.
  El schema define qué existe (nodos, marcas).
  Los plugins definen qué pasa (atajos, historial, reglas, reacciones).

  Un plugin puede encargarse de cosas como:

  ⌨️ Atajos de teclado (keymap)

  ↩️ Deshacer / rehacer (history)

  ✍️ Reglas al escribir (inputRules)

  👀 Reaccionar a cambios del editor

  🎯 Cambiar el estado según lo que haces
*/
export const EuclidesEditorPlugins = [
  history(),
  keymap(baseKeymap),
  buildEuclidesKeymap(EuclidesEditorSchema)
];
