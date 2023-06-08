import { FirestoreService } from 'src/app/servicios/firestore.service';
import { Component, EventEmitter, Output } from '@angular/core';
import { SweetAlertService } from 'src/app/servicios/sweet-alert.service';

@Component({
  selector: 'app-listado-especialidades',
  templateUrl: './listado-especialidades.component.html',
  styleUrls: ['./listado-especialidades.component.css']
})
export class ListadoEspecialidadesComponent {

  spinner: boolean = false;

  constructor(private firestore:FirestoreService, private sweetalert:SweetAlertService){
    this.nuevaEspecialidad = "";
    this.valorInput = "";
  }

  @Output() botonClickeado = new EventEmitter<any>();
  especialidades: string[] = [];
  listaFiltrada: string[] = [];
  valorInput: string;
  nuevaEspecialidad: string;
  inputValidado: boolean = false;
  cargo:boolean=false;
  arrayEspecialidades:any[]=[];

  ngOnInit(): void {
    this.spinner = true;
    this.listaFiltrada = [];
    this.firestore.traerEspecialidades().subscribe((data: any[]) => {
      setTimeout(() => {
        this.especialidades = data.map((doc: any) => doc.nombre);
        this.listaFiltrada = [...this.especialidades];
        this.cargo = true;
        this.spinner = false;
      }, 1);
    });
  }

  

  validarEspecialidad() {
    if (this.valorInput.match(/^[a-zA-Z ]+$/)) {
      this.inputValidado = true;
      this.nuevaEspecialidad = this.valorInput;
    }
    else {
      this.inputValidado = false;
    }
    this.valorInput = '';
    this.listaFiltrada = [...this.especialidades];
  }

  filtrarLista() {
    this.listaFiltrada = this.especialidades.filter((item: string) =>
      item.toLowerCase().includes(this.valorInput.toLowerCase())
    );
  }

  agregarItem() {
    if (this.inputValidado) {
      this.firestore.setEspecialidad(this.nuevaEspecialidad);
      this.sweetalert.showSuccessAlert("Especialidad agregada con éxito!", "AGREGADA", 'success');
    }
    else {
      this.sweetalert.showSuccessAlert("Sólo debe contener letras", "FALLÓ AL AGREGAR", 'error');
    }
  }


  ayuda() {
    this.sweetalert.showSuccessAlert("Si no encuentra su especialidad en la lista, puede agregarla escribiendola y tocando el botón '+'", "Modo de uso:", 'info');
  }


  clickListado(especialidad: any) {
    if(!this.arrayEspecialidades.includes(especialidad) && this.arrayEspecialidades.length < 5){
      this.arrayEspecialidades.push(especialidad);
      this.botonClickeado.emit(this.arrayEspecialidades);
    }
    else if(this.arrayEspecialidades.includes(especialidad) && this.arrayEspecialidades.length < 6)
    {
      let indice = this.arrayEspecialidades.indexOf(especialidad);
      this.arrayEspecialidades.splice(indice,1);
      this.botonClickeado.emit(this.arrayEspecialidades);
    }
  }
}
