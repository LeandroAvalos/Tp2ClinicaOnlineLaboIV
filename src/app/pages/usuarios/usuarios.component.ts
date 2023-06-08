import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../servicios/firestore.service'


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css'],
})
export class UsuariosComponent implements OnInit {
  usersList: any[] = [];
  createrUserMenu: boolean = false;
  formPaciente: boolean = false;
  formEspecialista: boolean = false;
  formAdministrador: boolean = false;
  spinner: boolean = false;
  listaFiltrada: string[] = [];
  especialidades: string[] = [];

  constructor(private firestore:FirestoreService) {}

  ngOnInit(): void {
    this.spinner = true;
    // setTimeout(() => {
    // }, 2000);
    this.firestore.traerUsuariosCombinados().subscribe((users) => {
      this.usersList = users;
      this.spinner = false;
    });

    this.listaFiltrada = [];
    this.firestore.traerEspecialidades().subscribe((data: any[]) => {
      setTimeout(() => {
        this.especialidades = data.map((doc: any) => doc.nombre);
        this.listaFiltrada = [...this.especialidades];
        this.spinner = false;
      }, 1);
    });
  }

  updateUser(user: any, option: number) {
    if (user.hasOwnProperty("especialidad")) {
      if (option == 1) {
        user.aprobado = true;
        this.firestore.updateEspecialista(user);
     
      } else if (option == 2) {
        user.aprobado = false;
        this.firestore.updateEspecialista(user);
 
      }
    }
  }

  showCreateUserMenu() {
    // this.spinner = true;
    // setTimeout(() => {
    //   this.spinner = false;
    // }, 1500);
    this.createrUserMenu = true;
  }

  showUserList() {
    this.createrUserMenu = false;
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
  }

  goToFormPaciente() {
    this.formPaciente = true;
  }

  goToFormEspecialista() {
    this.formEspecialista = true;
  }

  goToFormAdministrador() {
    this.formAdministrador = true;
  }

  goToRegistro() {
    this.formPaciente = false;
    this.formEspecialista = false;
    this.formAdministrador = false;
  }

}