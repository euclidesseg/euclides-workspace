import { Component, input, output, signal, effect } from '@angular/core';

@Component({
  selector: 'app-link-popover',
  templateUrl: './link-popover.component.html',
})
export class LinkPopoverComponent {

  visible = input<boolean>(false);
  initialUrl = input<string>('');

  confirm = output<string>();
  cancel = output<void>();
  remove = output<void>();

  url = signal<string>('google');

  constructor() {
    effect(() => {
      this.url.set(this.initialUrl());
    });
  }

  onConfirm() {
    if (!this.url()) return;
    this.confirm.emit(this.url());
  }
}