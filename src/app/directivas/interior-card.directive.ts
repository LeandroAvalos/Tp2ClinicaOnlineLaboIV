import {
  Directive,
  ElementRef,
  Input,
} from '@angular/core';

@Directive({
  selector: '[appInteriorCard]'
})
export class InteriorCardDirective {

  @Input('appInteriorCard') tipoTarjeta = '';

  constructor(private elementoHTML: ElementRef) {}

  ngOnInit(): void {
    const img = document.createElement('img');
    const parrafo = document.createElement('p');
    const small = document.createElement('small');
    let contenidoParrafo: any = '';
    let contenidoSmall: any = '';

    img.style.marginTop = '2rem';
    img.style.width = '8rem';
    img.style.display = 'block';
    img.style.marginLeft = 'auto';
    img.style.marginRight = 'auto';
    parrafo.style.textAlign = 'center';
    parrafo.style.fontSize = '1.4rem';
    parrafo.style.color = '#fff';
    parrafo.style.fontWeight = 'bolder';
    parrafo.style.textShadow = '1px 1px #000';
    parrafo.style.marginTop = '1rem';
    small.style.display = 'block';
    small.style.color = '#000';
    small.style.fontSize = '0.9rem';
    small.style.textAlign = 'center';
    small.style.fontWeight = 'bold';

    if (this.tipoTarjeta == 'log') {
      img.src = '../../assets/trabajando.png';
      contenidoParrafo = document.createTextNode('REGISTRO DE INICIO DE SESIÓN');
      contenidoSmall = document.createTextNode(
        'Todo el detalle de los usuarios que iniciaron sesión en la Clinica.'
      );
    } else if (this.tipoTarjeta == 'especialidad') {
      img.src = '../../assets/grafico-de-barras.png';
      contenidoParrafo = document.createTextNode('GRAFICO DE BARRAS POR ESPECIALIDAD');
      contenidoSmall = document.createTextNode(
        'Grafico de barras sobre la cantidad de turnos que fueron solicitados por especialidad.'
      );
    } else if (this.tipoTarjeta == 'dia') {
      img.src = '../../assets/grafico-circular.png';
      contenidoParrafo = document.createTextNode('GRAFICO DE TORTA DE TURNOS POR DÍA');
      contenidoSmall = document.createTextNode(
        'Grafico de torta sobre la cantidad de turnos que fueron solicitados por dia.'
      );
    } else if (this.tipoTarjeta == 'solicitados') {
      img.src = '../../assets/grafico-de-donas.png';
      contenidoParrafo = document.createTextNode('GRAFICO DE DONA DE TURNOS SOLICITADOS');
      contenidoSmall = document.createTextNode(
        'Grafico de dona sobre la cantidad de turnos solicitados a un medico en un periodo de tiempo.'
      );
    } else if (this.tipoTarjeta == 'finalizados') {
      img.src = '../../assets/reporte.png';
      contenidoParrafo = document.createTextNode('GRAFICO DE DONA DE TURNOS FINALIZADOS');
      contenidoSmall = document.createTextNode(
        'Reporte sobre los turnos finalizados por un medico en un periodo de tiempo.'
      );
    }

    parrafo.appendChild(contenidoParrafo);
    small.appendChild(contenidoSmall);

    this.elementoHTML.nativeElement.appendChild(img);
    this.elementoHTML.nativeElement.appendChild(parrafo);
    this.elementoHTML.nativeElement.appendChild(small);
  }

}
