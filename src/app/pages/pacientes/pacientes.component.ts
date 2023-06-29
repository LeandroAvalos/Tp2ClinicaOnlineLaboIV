import { Component, OnInit } from '@angular/core';
import { FirestoreService } from 'src/app/servicios/firestore.service';


import { LoginService } from 'src/app/servicios/login.service';
import { SweetAlertService } from 'src/app/servicios/sweet-alert.service';

@Component({
  selector: 'app-pacientes',
  templateUrl: './pacientes.component.html',
  styleUrls: ['./pacientes.component.scss'],
})
export class PacientesComponent implements OnInit {
  spinner: boolean = false;
  user: any = null;
  usersList: any[] = [];

  pacientesAtendidos: any[] = [];

  historialClinico: any[] = [];
  historialActivo: any[] = [];
  historialClinicoDelEspecialista: any[] = [];
  hayPacientesAtendidos: boolean = false;
  pacienteActivo:any;

  isPaciente: boolean = false;
  isEspecialista: boolean = false;
  currentSpecialistTurnList: any[] = [];
  turnList: any[] = [];
  turnosDelPaciente: any[] = [];
  turnosDelEspecialista: any[] = [];
  pacientesDelEspecialista: any[] = [];
  auxPacientesDelEspecialista: any[] = [];
  turnosFiltrados: any[] = [];
  listaDeEspecialistas: any[] = [];

  constructor(
    private authService: LoginService,
    private notificationService: SweetAlertService,
    private firestore:FirestoreService,
    private firestoreService: FirestoreService
  ) {}

  ngOnInit(): void {
    this.spinner = true;
    this.authService.user$.subscribe((user: any) => {
      this.spinner = false;
      if (user) {
        this.user = user;
        this.authService.seLogueo = true;
      }
      this.firestore.traer().subscribe((users:any) => {
        if (users) {
          this.usersList = users;
        }
        this.firestore.getHistorialesClinicos().subscribe((historial:any) => {
          this.historialClinico = historial;
          this.pacientesAtendidos = [];
          this.historialClinicoDelEspecialista = [];
          historial.forEach((h:any) => {
            for (let i = 0; i < this.usersList.length; i++) {
              const usuario = this.usersList[i];
              if (
                usuario.uid == h.paciente.uid &&
                this.user.uid == h.especialista.uid
              ) {
                this.usersList[i].historial = true;
                this.pacientesAtendidos = this.pacientesAtendidos.filter(
                  (p) => {
                    return p.uid != usuario.uid;
                  }
                );
                this.pacientesAtendidos.push(usuario);
                // console.log(this.usersList[i]);
              }
            }
          });

          this.historialClinicoDelEspecialista = this.historialClinico.filter(
            (h) => {
              return h.especialista.uid == user.uid;
            }
          );

          this.historialClinicoDelEspecialista.forEach((h) => {
            h.paciente.contadorHistorial = 0;
          });
          for (let i = 0; i < this.pacientesAtendidos.length; i++) {
            const paciente = this.pacientesAtendidos[i];
            paciente.contador = 0;
            this.historialClinicoDelEspecialista.forEach((h) => {
              if (paciente.uid == h.paciente.uid) {
                paciente.contador++;
                h.paciente.contador = paciente.contador;
              }
            });
          }

          if (this.pacientesAtendidos.length == 0) {
            this.hayPacientesAtendidos = false;
          } else {
            this.hayPacientesAtendidos = true;
          }
        });
      });
    });

    


    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.spinner = false;
        this.user = user;
        if (this.user.obraSocial) {
          this.isPaciente = true;
        } else {
          this.isEspecialista = true;
        }

        this.firestoreService.getTurnList().subscribe((turns: any) => {
          this.currentSpecialistTurnList = turns;
          this.turnList = [];
          this.turnosFiltrados = [];
          this.turnosDelPaciente = [];
          this.turnosDelEspecialista = [];
          this.pacientesDelEspecialista = [];
          this.auxPacientesDelEspecialista = [];
          for (let i = 0; i < turns.length; i++) {
            const turnSpecialist = turns[i].turnos;
            for (let j = 0; j < turnSpecialist.length; j++) {
              const turn = turnSpecialist[j];
              if (turn.estado != 'disponible') {
                this.turnList.push(turn);
                if (turn.paciente.uid == this.user.uid) {
                  this.turnosDelPaciente.push(turn);
                }
                if (turn.especialista.uid == this.user.uid) {
                  this.turnosDelEspecialista.push(turn);
                  this.auxPacientesDelEspecialista.push(turn.paciente);
                }
              }
            }
          }

          for (let i = 0; i < this.auxPacientesDelEspecialista.length; i++) {
            const paciente = this.auxPacientesDelEspecialista[i];
            const index = this.pacientesDelEspecialista.findIndex((p) => {
              return paciente.uid == p.uid;
            });
            if (index == -1) {
              this.pacientesDelEspecialista.push(paciente);
            }
          }

          if (this.isPaciente) {
            this.turnosFiltrados = [...this.turnosDelPaciente];
          } else if (this.isEspecialista) {
            this.turnosFiltrados = [...this.turnosDelEspecialista];
          }
        });
      }
    });

    this.firestoreService.traerEsp().subscribe((users:any) => {
      this.spinner = false;
      if (users) {
        this.listaDeEspecialistas = users.filter(
          (u:any) => u.especialidad && u.aprobado
        );
      }
    });
  }

  verHistorialPaciente(paciente: any) {
    this.historialActivo = [];
    this.pacienteActivo = paciente;
    for (let i = 0; i < this.historialClinico.length; i++) {
      const historial = this.historialClinico[i];
      if (historial.paciente.uid == paciente.uid) {
        this.historialActivo.push(historial);
      }
    }
  }
}