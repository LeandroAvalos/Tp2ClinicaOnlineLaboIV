import {
  Directive,
  ElementRef,
  HostListener,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appDeslizarCards]'
})
export class DeslizarCardsDirective {

  @Input('appDeslizarCards') colorHover = '';

  constructor(private elementoHTLM: ElementRef) {}

  ngOnInit(): void {}

  @HostListener('mouseenter') onMouseEnter() {
    this.hover(this.colorHover);
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hover('default');
  }

  private hover(color: string) {
    if (color == 'verde') {
      this.elementoHTLM.nativeElement.style.background = '#0d6efd';
      this.elementoHTLM.nativeElement.style.transition = 'background 0.5s';
      this.elementoHTLM.nativeElement.style.cursor = 'pointer';
    }

    if (color == 'default') {
      this.elementoHTLM.nativeElement.style.background = '#009C8C99';
    }
  }

}
