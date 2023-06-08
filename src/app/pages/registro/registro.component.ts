import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css']
})
export class RegistroComponent {

  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  listaFiltrada: string[] = [];
  especialidades: string[] = [];
  spinner:boolean=false;

  constructor(private firestore:FirestoreService){

  }

  ngOnInit(){
    this.spinner = true;
    this.listaFiltrada = [];
    this.firestore.traerEspecialidades().subscribe((data: any[]) => {
      setTimeout(() => {
        this.especialidades = data.map((doc: any) => doc.nombre);
        this.listaFiltrada = [...this.especialidades];
        this.spinner = false;
      }, 1);
    });
  }
  
  goToFormPaciente() {
    this.formPaciente = true;
  }

  goToFormEspecialista() {
    this.formEspecialista = true;
  }

  goToRegistro() {
    this.formPaciente = false;
    this.formEspecialista = false;
  }
}
