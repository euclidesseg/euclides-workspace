import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
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
