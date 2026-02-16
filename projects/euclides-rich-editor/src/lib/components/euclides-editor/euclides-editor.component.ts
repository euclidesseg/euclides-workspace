import { AfterViewInit, Component, ElementRef, inject, viewChild, ViewChild, ViewEncapsulation } from '@angular/core';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { EuclidesEditorSchema } from '../../engine/schema/euclides-schema';
// import { EuclidesEditorPlugins } from '../../engine/plugins/euclides-plugins';
// import { HistoriButtonsPlugins } from '../../engine/plugins/history-buttons.plugin';

import { toggleMark } from 'prosemirror-commands';
import { EditorCommandsService } from '../../core/editor-commands.service';
import { EditorEngine } from '../../engine/editor-engine';
import { EditorStateService } from '../../core/editor-state.service';


@Component({
  selector: 'euclides-rich-editor',
  standalone: true,
  templateUrl: './euclides-editor.component.html',
})
export class EuclidesEditorComponent implements AfterViewInit {

  editorCommandsService = inject(EditorCommandsService);
  editorStateService = inject(EditorStateService)

  // *@ViewChild permite obtener acceso directo a un elemento 
  // *o componente hijo mediante una referencia en este caso llamada editor
  // * - static: true → indica que la referencia debe resolverse

  @ViewChild('editor', { static: true })
  editorRef!: ElementRef<HTMLDivElement>;

  view!: EditorView;

  // * ngAfterViewInit es un lifecycle hook (evento del ciclo de vida) de Angular.
  // * Se ejecuta: Después de que Angular haya renderizado completamente la vista del componente y sus hijos.
  ngAfterViewInit() {
    this.view = EditorEngine.create(this.editorRef.nativeElement, this.editorStateService)
  }

  toggleBold(){
    if(this.editorCommandsService.toggleBold(this.view))
      this.view.focus();
  }
}
 