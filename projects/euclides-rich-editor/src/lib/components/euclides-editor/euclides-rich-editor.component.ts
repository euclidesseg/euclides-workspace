import { AfterViewInit, Component, ElementRef, inject, OnDestroy, viewChild, ViewChild, ViewEncapsulation } from '@angular/core';
import { EditorView } from 'prosemirror-view';

import { EditorCommandsService } from '../../core/editor-commands.service';
import { EditorEngine } from '../../engine/editor-engine';
import { EditorStateService } from '../../core/editor-state.service';


@Component({
  selector: 'euclides-rich-editor',
  standalone: true,
  templateUrl: './euclides-editor.component.html',
})
export class EuclidesRichEditorComponent implements AfterViewInit, OnDestroy {

  editorCommandsService = inject(EditorCommandsService);
  editorStateService = inject(EditorStateService)

  // referencia para obtener el contenedor del editor
  @ViewChild('editor', { static: true })
  editorRef!: ElementRef<HTMLDivElement>;

  view!: EditorView;

  // ngAfterViewInit es un lifecycle hook (evento del ciclo de vida) de Angular.
  // Se ejecuta: Después de que Angular haya renderizado completamente la vista del componente y sus hijos.
  // esto garantiza que editorRef está creado
  ngAfterViewInit() {
    // creamos la vista con el editor y el editorStateService
    // esta requeire el editor que se obeitne desde EditorEngine, y requiere un servicio para registrar el comportamiento
    // de los botones undo y redo
    this.view = EditorEngine.create(this.editorRef.nativeElement, this.editorStateService)
  }

  toggleBold(){
    if(this.editorCommandsService.toggleBold(this.view))
      this.view.focus();
  }

  ngOnDestroy():void{
    this.view.destroy();
  }
}
 
// TODO profundizar en el euclides-schema
// TODO agrgar comportamientos
// TODO separar nav y editor en componentes separados
// TODO Entender cómo funcionan las InputRules en ProseMirror y agregarlas a los plugins
// TODO comprender la abstraccion de prosemirror