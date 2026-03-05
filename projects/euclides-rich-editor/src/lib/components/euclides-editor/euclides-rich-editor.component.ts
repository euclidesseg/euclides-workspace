import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal, viewChild, ViewChild, ViewEncapsulation } from '@angular/core';
import { EditorView } from 'prosemirror-view';

import { EditorCommandsService } from '../../core/editor-commands.service';
import { EditorEngine } from '../../engine/editor-engine';
import { EditorStateService } from '../../core/editor-state.service';
import { list } from '../../core/types/list.type';
import { redo, undo } from 'prosemirror-history';
import { getLinkRange } from '../../core/utils/get-link-range';
import { LinkPopoverComponent } from "../link-popover/link-popover.component";
import { EuclidesEditorSchema } from '../../engine/schema/euclides-schema';
import { applyLink } from '../../engine/commanmethods/links/apply-link';
import { removeLink } from '../../engine/commanmethods/links/remove-link';


@Component({
  selector: 'euclides-rich-editor',
  standalone: true,
  templateUrl: './euclides-editor.component.html',
  imports: [LinkPopoverComponent],
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

  toggleBold() {
    console.log(this.view)
    if (this.editorCommandsService.toggleBold(this.view)) {

      this.view.focus();
    }
  }
  toggleItalic() {
    if (this.editorCommandsService.toggleItailc(this.view)) {
      this.view.focus()
    }
  }

  toggleAlign(align: string) {
    if (this.editorCommandsService.setTextAlign(align, this.view))
      this.view.focus()
  }

  toggleCodeBlock() {
    if (this.editorCommandsService.toggleCodeBlock(this.view))
      this.view.focus()
  }
  toggleStrike() {
    if (this.editorCommandsService.toggleStrike(this.view))
      this.view.focus()
  }
  toggleList(type: list) {
    console.log(EuclidesEditorSchema.nodes)
    if (this.editorCommandsService.toggleList(type, this.view))
      this.view.focus();
  }

  undo() {
    if (undo(this.view.state, this.view.dispatch))
      this.view.focus();
  }

  redo() {
    if (redo(this.view.state, this.view.dispatch))
      this.view.focus();
  }

  showLinkPopover = signal<boolean>(false);
  currentLink: string = '';

  openLinkPopover() {
    this.showLinkPopover.set(true);
  }

  closePopover() {
    this.showLinkPopover.set(false);
  }

  applyLink(url: string) {
    if (applyLink(url, this.view)) {
      this.view.focus();
      this.closePopover()
    }
  }

  removeLink() {
    removeLink(this.view);
    this.closePopover();
    this.view.focus();
  }

  ngOnDestroy(): void {
    this.view.destroy();
  }
}

// TODO profundizar en el euclides-schema //in progress
// TODO agrgar comportamientos // in progress
// TODO agregar enter de listas 
// TODO separar nav y editor en componentes separados
// TODO Entender cómo funcionan las InputRules en ProseMirror y agregarlas a los plugins
// TODO comprender la abstraccion de prosemirror
// TODO Blockquote avanzado Un bloque tipo cita con atributo author