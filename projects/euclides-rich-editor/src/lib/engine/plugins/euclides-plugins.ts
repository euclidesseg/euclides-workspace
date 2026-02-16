import { keymap } from 'prosemirror-keymap';
import { baseKeymap} from 'prosemirror-commands';
import { history } from 'prosemirror-history';
import { EuclidesEditorSchema } from '../schema/euclides-schema';
import { buildEuclidesKeymap } from '../keymaps/euclides-keymaps';
import { EditorStateService } from '../../core/editor-state.service';
import { buildHistoryStatePlugin } from './history-buttons.plugin';

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

/*
  Este plugin NO modifica el documento ni el estado del editor.
  Su única responsabilidad es sincronizar la interfaz (UI) con el estado actual del editor.
  - Si no hay nada que deshacer, deshabilita el botón Undo.
  - Si no hay nada que rehacer, deshabilita el botón Redo.
*/

export function buildPlugins(stateService: EditorStateService){
  return [
    history(),
    keymap(baseKeymap),
    buildEuclidesKeymap(EuclidesEditorSchema),
    buildHistoryStatePlugin(stateService),
  ];
}