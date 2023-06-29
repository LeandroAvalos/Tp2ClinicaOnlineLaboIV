import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../servicios/firestore.service'
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { SweetAlertService } from 'src/app/servicios/sweet-alert.service';
import { LoginService } from 'src/app/servicios/login.service';
// import * as XLSX from 'xlsx/xlsx.mjs';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';


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

  historialClinico: any[] = [];
  historialActivo: any[] = [];
  hayHistorial: boolean = false;

  listaTurnos: any[] = [];

  constructor(private firestore:FirestoreService, private sweetalert:SweetAlertService) {}

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

    // this.firestore.traer().subscribe((users) => {
    //   if (users) {
    //     this.usersList = users;
    //   }
      
      
      this.firestore.getHistorialesClinicos().subscribe((historial) => {
        this.historialClinico = historial;
        historial.forEach((h) => {
          for (let i = 0; i < this.usersList.length; i++) {
            const usuario = this.usersList[i];
            if (usuario.hasOwnProperty('obraSocial') && usuario.uid == h.paciente.uid) {
              this.usersList[i].historial = true;
              console.log(this.usersList[i]);
            }
          }
        });
      });

      this.firestore.getTurnList().subscribe((turnos: any) => {
        this.listaTurnos = [];
        for (let i = 0; i < turnos.length; i++) {
          const turnoEspecialista = turnos[i].turnos;
          for (let j = 0; j < turnoEspecialista.length; j++) {
            const t = turnoEspecialista[j];
            this.listaTurnos.push(t);
          }
        }
        // console.log(this.listaTurnos);
      });
    // });
    console.log(this.historialClinico);
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

  verHistorialPaciente(paciente: any) {
    this.historialActivo = [];
    for (let i = 0; i < this.historialClinico.length; i++) {
      const historial = this.historialClinico[i];
      if (historial.paciente.uid == paciente.uid) {
        this.historialActivo.push(historial);
      }
    }
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }

  descargarExcel() {
    this.exportAsExcelFile(this.usersList, 'listadoUsuarios');
    this.sweetalert.showSuccessAlert(
      'Listado de Usuarios descargado',
      'Usuarios',
      'success'
    );
  }

  verTurnosUsuario(usuario: any) {
    const listaTurnosUsuario: any[] = [];
    if (usuario.hasOwnProperty('obraSocial')) {
      this.listaTurnos.forEach((t: any) => {
        if (usuario.uid == t?.paciente?.uid) {
          const turno: any = {};
          turno.nombrePaciente = usuario.nombre;
          turno.apellidoPaciente = usuario.apellido;
          turno.fecha = new Date(t.fecha.seconds * 1000);
          turno.especialidad = t.especialidad;
          turno.nombreEspecialista = t.especialista.nombre;
          turno.apellidoEspecialista = t.especialista.apellido;
          listaTurnosUsuario.push(turno);
        }
      });
      if (listaTurnosUsuario.length == 0) {
        this.sweetalert.showSuccessAlert(
          'El PACIENTE no tiene turnos',
          'Usuarios',
          'warning'
        );
      } else {
        this.exportAsExcelFile(listaTurnosUsuario, 'turnosPaciente');
        this.sweetalert.showSuccessAlert(
          'Turnos del PACIENTE descargado',
          'Usuarios',
          'success'
        );
      }
    } else {
      this.sweetalert.showSuccessAlert(
        'Debes elegir un PACIENTE',
        'Usuarios',
        'warning'
      );
    }
  }

}