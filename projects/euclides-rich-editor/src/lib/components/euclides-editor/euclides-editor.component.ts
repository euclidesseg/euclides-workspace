import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';

import { EuclidesEditorSchema } from '../../engine/schema/euclides-schema';
import { EuclidesEditorPlugins } from '../../engine/plugins/euclides-plugins';


@Component({
  selector: 'euclides-rich-editor',
  standalone: true,
  template: `<div #editor class="editor"></div>`,
  styles: `
    .editor {
      border: 1px solid #ccc;
      min-height: 150px;
      padding: 8px;
      cursor: text;
    }
  `
})
export class EuclidesEditorComponent implements AfterViewInit {

  @ViewChild('editor', { static: true })
  editorRef!: ElementRef<HTMLDivElement>;

  view!: EditorView;


  ngAfterViewInit() {
    const state = EditorState.create({
      schema: EuclidesEditorSchema,
      plugins: EuclidesEditorPlugins
    });

    this.view = new EditorView(this.editorRef.nativeElement, {
      state
    });

  }
}
