import { Component, signal } from '@angular/core';
import {EuclidesRichEditorComponent} from "euclides-rich-editor";

@Component({
  selector: 'app-root',
  imports: [EuclidesRichEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('euclides-demo');
}
