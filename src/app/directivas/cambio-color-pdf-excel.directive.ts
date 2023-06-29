import {
  Directive,
  ElementRef,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appCambioColorPdfExcel]'
})
export class CambioColorPdfExcelDirective {

  @Input('appCambioColorPdfExcel') tipoBoton = '';

  constructor(private elementoHTML: ElementRef) {}

  ngOnInit() {
    this.elementoHTML.nativeElement.classList.add('btn');
    if (this.tipoBoton == 'pdf') {
      this.elementoHTML.nativeElement.classList.add('btn-primary');
    } 
    else if (this.tipoBoton == 'excel') {
      this.elementoHTML.nativeElement.classList.add('btn-warning');
    }
    else if (this.tipoBoton == 'sieteDias') {
      this.elementoHTML.nativeElement.classList.add('btn-primary');
    }
    else if (this.tipoBoton == 'quinceDias') {
      this.elementoHTML.nativeElement.classList.add('btn-warning');
    }
  }

}
