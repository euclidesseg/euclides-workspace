import { ChangeDetectionStrategy, Component, ElementRef, HostListener, inject, input, output } from '@angular/core';

@Component({
  selector: 'heading-selector',
  templateUrl: './heading-selector.component.html',
  styles: `
    .euclides__heading--selector{
        width: 100%;
        height: auto;
        display: flex;
        background-color: white;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: absolute;
        top: 2.2rem;
        z-index: 99;
        border-radius: .5rem;
        box-shadow: 0px 0px 10px -5px #808080d1;
        padding: .5rem;
    }
  `
})
export class HeadingSelectorComponent {
    private el = inject(ElementRef)
    public visible = input<boolean>(false);

    headingSelected = output<number>();
    close = output<void>();

    @HostListener('document:click', ['$event'])
    onDocumentClick(event:MouseEvent){
      if(!this.visible())return

      const clickedInside = this.el.nativeElement.contains(event.target);
      if(!clickedInside){
       this.close.emit();
      }
    }

    onHead(level:number):void{
      this.headingSelected.emit(level);
    }
}
