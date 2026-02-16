import { Plugin } from "prosemirror-state";
import { undoDepth, redoDepth } from "prosemirror-history";
import { EditorStateService } from "../../core/editor-state.service";

export function buildHistoryStatePlugin(stateService: EditorStateService):Plugin {

  return new Plugin({
    view(view) {

      const updateState = () => {
        stateService.canUndo.set(undoDepth(view.state) > 0);
        stateService.canRedo.set(redoDepth(view.state) > 0);
      };

      updateState();

      return {
        update() {
          updateState();
        }
      };
    }
  });
}
