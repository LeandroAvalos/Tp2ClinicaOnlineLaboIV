import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { LoginService } from 'src/app/servicios/login.service';
import { SweetAlertService } from 'src/app/servicios/sweet-alert.service';

@Component({
  selector: 'app-solicitar-turno',
  templateUrl: './solicitar-turno.component.html',
  styleUrls: ['./solicitar-turno.component.scss']
})
export class SolicitarTurnoComponent {
  user: any = null;
  isPaciente: boolean = false;
  spinner: boolean = false;

  especialistasList: any[] = [];
  pacientesList: any[] = [];
  activeEspecialista: any = null;
  activePaciente: any = null;
  speciality: any = null;
  specialistSelectionMenu: boolean = true;
  patientSelectionMenu: boolean = false;
  turnsSelectionMenu: boolean = false;

  especialidades:any[]=[];
  especialidadMenuSeleccion:boolean = true;
  arrayEspecialista:any[]=[];

  currentSpecialistTurnList: any[] = [];
  turnosAMostrar: any[] = [];
  turnosDeUnDiaAMostrar: any[] = [];
  diasAMostrar: any[] = [];
  botonPedirTurno: boolean = false;
  turnoSeleccionado: any = null;

  constructor(
    public authService: LoginService,
    public firestoreService: FirestoreService,
    private notificationService: SweetAlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.spinner = true;
    this.authService.user$.subscribe((user: any) => {
      if (user) {
        this.spinner = false;
        this.user = user;
        if (this.authService.esAdmin) {
          this.patientSelectionMenu = true;
        } else if (this.user.obraSocial) {
          this.isPaciente = true;
        } else {
          this.router.navigate(['']);
        }

        this.firestoreService.traerEspecialidades().subscribe((espe:any)=>{
          this.especialidades = espe;
        })

        this.firestoreService.traerEsp().subscribe((users: any) => {
          this.spinner = false;
          if (users) {
            this.especialistasList = users.filter(
              (u: any) => u.especialidad && u.aprobado
            );
          }
        });

        this.firestoreService.traer().subscribe((users: any) => {
          this.spinner = false;
          if (users) {
            this.pacientesList = users.filter(
              (u: any) => u.obraSocial
            );
          }
        });

        this.firestoreService.getTurnList().subscribe((turnosEspecialista) => {
          this.currentSpecialistTurnList = turnosEspecialista;
        });
      }
    });

    console.log(this.speciality);
  }

  showSpeciality(esp: any) {
    this.specialistSelectionMenu = false;
    this.activeEspecialista = esp;
    console.log(this.speciality);
  }

  volverALasEspecialidades(){
    this.especialidadMenuSeleccion = true;
    this.patientSelectionMenu = false;
    this.speciality = undefined;
    console.log(this.speciality);
    this.turnsSelectionMenu = false;
  }

  showEspecialista(especialidad:any){
    this.arrayEspecialista = [];
    this.especialidadMenuSeleccion = false;
    this.speciality = especialidad;
    console.log(this.speciality);

    for (let i = 0; i < this.especialistasList.length; i++) {
      
      for (let j = 0; j < this.especialistasList[i].especialidad.length; j++) {
        
        if(this.speciality.nombre == this.especialistasList[i].especialidad[j].nombre)
        {
          this.arrayEspecialista.push(this.especialistasList[i]);
        }
        
      }
      
    }
    console.log(this.arrayEspecialista);
  }

  showPatient(paciente: any) {
    this.patientSelectionMenu = false;
    this.activePaciente = paciente;
    console.log(paciente);
  }

  showTurns(especialista: any) {
    this.turnsSelectionMenu = true;
    this.activeEspecialista = especialista;
    this.loadFreeHours('');
    this.turnosAMostrar.forEach((t) => {
      this.diasAMostrar.push(t.fecha);
    });

    const aux: any[] = [];
    this.diasAMostrar.forEach((d) => {
      for (let i = 0; i < this.diasAMostrar.length; i++) {
        const fecha = this.diasAMostrar[i];
        if (
          d.getMonth() == fecha.getMonth() &&
          d.getDate() == fecha.getDate()
        ) {
          if (
            !aux.some((a) => {
              return d.getMonth() == a.getMonth() && d.getDate() == a.getDate();
            })
          ) {
            aux.push(d);
          }
        }
      }
    });
    aux.sort((a, b) => a - b);
    this.diasAMostrar = [...aux];
  }

  loadFreeHours(day: string) {
    const currentDate = new Date();
    const listaTurnosDelEspecialista = this.currentSpecialistTurnList.filter(
      (t) => t.especialista.mail == this.activeEspecialista.mail
    );
    const turnosEspecialidad =
      listaTurnosDelEspecialista[0].turnos.filter((t: any) => {
        return (
          t.especialidad == this.speciality.nombre &&
          currentDate.getTime() < new Date(t.fecha.seconds * 1000).getTime()
        );
      });
    const turnos15dias: any[] = [];
    for (let i = 0; i < turnosEspecialidad.length; i++) {
      const turno = { ...turnosEspecialidad[i] };
      if (
        new Date(turno.fecha.seconds * 1000).getTime() <=
        currentDate.getTime() + 84600000 * 15 &&
        turno.estado == 'disponible'
      ) {
        turno.fecha = new Date(turno.fecha.seconds * 1000);
        turnos15dias.push(turno);
      }
    }
    this.turnosAMostrar = [...turnos15dias];
  }

  loadFreeHoursOneDay(date: Date) {
    this.spinner = true;
    this.turnosDeUnDiaAMostrar = [];
    setTimeout(() => {
      const currentDate = new Date();
      const listaTurnosDelEspecialista = this.currentSpecialistTurnList.filter(
        (t) => t.especialista.mail == this.activeEspecialista.mail
      );
      const turnosEspecialidad =
        // listaTurnosDelEspecialista[0].turnos =
        listaTurnosDelEspecialista[0].turnos.filter((t: any) => {
          return (
            t.especialidad == this.speciality.nombre &&
            currentDate.getTime() < new Date(t.fecha.seconds * 1000).getTime()
          );
        });
      // console.log(listaTurnosDelEspecialista[0].turnos);
      // console.log(turnosEspecialidad);
      const turnosDeUndia: any[] = [];
      for (let i = 0; i < turnosEspecialidad.length; i++) {
        const turno = { ...turnosEspecialidad[i] };
        if (
          new Date(turno.fecha.seconds * 1000).getTime() <=
          currentDate.getTime() + 84600000 * 15 &&
          new Date(turno.fecha.seconds * 1000).getDate() == date.getDate() &&
          turno.estado == 'disponible'
        ) {
          turno.fecha = new Date(turno.fecha.seconds * 1000);
          turnosDeUndia.push(turno);
        }
      }
      this.spinner = false;
      this.turnosDeUnDiaAMostrar = [...turnosDeUndia];
    }, 500);
  }

  seleccionarTurno(turno: any) {
    this.turnoSeleccionado = turno;
    this.botonPedirTurno = true;
    this.notificationService.showSuccessAlert('Turno seleccionado', 'Turnos', 'info');
  }

  solicitarTurno() {
    if (this.isPaciente) {
      this.turnoSeleccionado.paciente = this.user;
      this.turnoSeleccionado.estado = 'solicitado';
    } else {
      this.turnoSeleccionado.paciente = this.activePaciente;
      this.turnoSeleccionado.estado = 'solicitado';
    }
    for (let i = 0; i < this.currentSpecialistTurnList.length; i++) {
      const turnosEspecialista = this.currentSpecialistTurnList[i];
      const index = turnosEspecialista.turnos.findIndex((t: any) => {
        return (
          new Date(t.fecha.seconds * 1000).getTime() ==
          this.turnoSeleccionado.fecha.getTime() &&
          t.especialidad == this.turnoSeleccionado.especialidad
        );
      });
      turnosEspecialista.turnos[index] = this.turnoSeleccionado;
      this.firestoreService.updateTurnList(turnosEspecialista);
    }
    this.turnosAMostrar = [];
    this.turnosDeUnDiaAMostrar = [];
    this.botonPedirTurno = false;
    this.spinner = true;
    setTimeout(() => {
      this.spinner = false;
      this.notificationService.showSuccessAlert('Turno Solicitado', 'Turnos', 'success');
      this.loadFreeHours('');
    }, 1000);
  }
}
