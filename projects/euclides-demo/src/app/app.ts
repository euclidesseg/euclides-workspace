import { Component, signal } from '@angular/core';
import {EuclidesEditorComponent} from "euclides-rich-editor";

@Component({
  selector: 'app-root',
  imports: [EuclidesEditorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('euclides-demo');
}
