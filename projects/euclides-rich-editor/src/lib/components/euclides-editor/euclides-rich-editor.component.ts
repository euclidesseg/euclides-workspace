import { AfterViewInit, Component, ElementRef, inject, OnDestroy, signal, ViewChild } from '@angular/core';
import { EditorView } from 'prosemirror-view';
import { redo, undo } from 'prosemirror-history';

import { LinkPopoverComponent } from "../link-popover/link-popover.component";
import { HeadingSelectorComponent } from '../heading-selector/heading-selector.component';

import { EditorEngine } from '../../engine/editor-engine';
import { EditorStateService } from '../../core/services/editor-state.service';
import { list } from '../../core/types/list.type';
import { EuclidesEditorSchema } from '../../engine/schema/euclides-schema';
import { applyLink } from '../../engine/commanmethods/links/apply-link';
import { removeLink } from '../../engine/commanmethods/links/remove-link';
import { turnIntoHeading } from '../../engine/commanmethods/headers/turn-into-heading';
import { getLinkRange } from '../../core/utils/links/get-link-range';
import { EditorCommandsService } from '../../core/services/editor-commands.service';
import { ImageSelectorService } from '../../core/services/image.service';


@Component({
  selector: 'euclides-rich-editor',
  standalone: true,
  templateUrl: './euclides-editor.component.html',
  imports: [LinkPopoverComponent, HeadingSelectorComponent],
})
export class EuclidesRichEditorComponent implements AfterViewInit, OnDestroy {

  editorCommandsService = inject(EditorCommandsService);
  editorStateService = inject(EditorStateService)
  imageSelectorService = inject(ImageSelectorService);

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


  // Logica ventana de enlaces y encabezados
  showLinkPopover = signal<boolean>(false);
  showHeadingSelector = signal<boolean>(false);

  currentLink = signal<string>('');


  openHeading() {
    this.showHeadingSelector.set(true);
  }
  closeHeading() {
    this.showHeadingSelector.set(false);
  }
  onSetHead(level: number): void {
    const executed = this.editorCommandsService.toggleHeading(level, this.view);
    if (executed) {
      this.view.focus();
    }
    this.closeHeading();
  }

  openLinkPopover() {
    if (!this.showLinkPopover()) {

      const linkInfo = getLinkRange(this.view.state);

      if (linkInfo) {
        this.currentLink.set(linkInfo.link.attrs['href']);
      } else {
        this.currentLink.set('');
      }

    }
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

  addImage() {
   this.imageSelectorService.openImageSelector((image) =>{
    this.editorCommandsService.addImage(this.view, image);
    this.view.focus();
   })
  }

  ngOnDestroy(): void {
    this.view.destroy();
  }
}

// TODO profundizar en el euclides-schema //in progress
// TODO agrgar comportamientos iniciales para primera version // in progress 90% adding image
// TODO documentar las funciones que intervienen en agregar una imagen
// TODO obtener el json del editor con los datos que se hallan escritos 
// TODO usar renderer2 de angular para anejo de DOM -- en la inegracion de la imagen
// TODO separar nav y editor en componentes separados
// TODO comprender la abstraccion de prosemirror
// TODO solucionar problema con z-index image vs toolbar 

//====**** Nota las tareas son indispensables para la primera version
// TODO Entender cómo funcionan las InputRules en ProseMirror y agregarlas a los plugins
// TODO Blockquote avanzado Un bloque tipo cita con atributo author
// TODO para un futuro posibilidad de agregar enlace y texto diferente al enlace.

