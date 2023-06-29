import { Component, OnInit } from '@angular/core';

import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
// import * as XLSX from 'xlsx/xlsx.mjs';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import {
  Chart,
  BarElement,
  BarController,
  CategoryScale,
  Decimation,
  Filler,
  Legend,
  Title,
  Tooltip,
  LinearScale,
  registerables,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { LoginService } from 'src/app/servicios/login.service';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.component.html',
  styleUrls: ['./graficos.component.scss']
})
export class GraficosComponent {

  spinner: boolean = false;
  listaLogs: any[] = [];
  listaTurnos: any[] = [];

  //@ts-ignore
  chartPorEspecialidad: any;

  btn7Dias: boolean = false;
  btn15Dias: boolean = true;
  banderaChartSolicitados: boolean = true;

  btn7DiasFinalizado: boolean = false;
  btn15DiasFinalizado: boolean = true;
  banderaChartFinalizados = true;

  //directivas

  constructor(private firestore:FirestoreService) {
    Chart.register(
      BarElement,
      BarController,
      CategoryScale,
      Decimation,
      Filler,
      Legend,
      Title,
      Tooltip,
      LinearScale,
      ChartDataLabels
    );
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    this.firestore.getUsersLog().subscribe((logs:any) => {
      this.listaLogs = logs;
      this.listaLogs.forEach((l) => {
        l.fecha = new Date(l.fecha.seconds * 1000);
      });
    });
    this.firestore.getTurnList().subscribe((turnos) => {
      this.listaTurnos = [];
      for (let i = 0; i < turnos.length; i++) {
        const turnosEspecialista = turnos[i].turnos;
        turnosEspecialista.forEach((t: any) => {
          if (t.estado != 'disponible') {
            this.listaTurnos.push(t);
          }
        });
      }
      this.generarChartClienteHumor();
      this.generarChartTurnosPorDia();
      this.generarChartTurnosSolicitadosPorMedico(this.listaTurnos);
      this.generarChartTurnosFinalizadosPorMedico(this.listaTurnos);
      // console.log(this.listaTurnos);
    });
  }

  // LOGS DE USUARIOS
  descargarPDFLogs() {
    this.spinner=true;
    const DATA = document.getElementById('pdflogs');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        this.spinner=false;
        docResult.save(`logs_usuarios.pdf`);
      });
  }

  descargarExcelLogs() {
    this.exportAsExcelFile(this.listaLogs, 'logUsuarios');
  }

  // CHART CANTIDAD DE TURNOS POR ESPECIALIDAD
  generarChartClienteHumor() {
    const ctx = (<any>(
      document.getElementById('turnosPorEspecialidad')
    )).getContext('2d');

    const colors = [
      '#71B340',
      '#414288',
      '#CB793A',
      '#DE639A',
      '#F7B801',
      '#950952',
      '#756D54',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    let listaTurnos = [0, 0, 0];
    this.listaTurnos.forEach((t) => {
      if (t.especialidad == 'Pediatra') {
        listaTurnos[0]++;
      } else if (t.especialidad == 'Odontologia') {
        listaTurnos[1]++;
      } else if (t.especialidad == 'Traumatologia') {
        listaTurnos[2]++;
      }
    });

    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Pediatra', 'Odontologia', 'Traumatologia'],
        datasets: [
          {
            label: undefined,
            data: listaTurnos,
            backgroundColor: turnosColores,
            borderColor: ['#fff'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: false,
          },
          title: {
            display: true,
            text: 'Turnos dados por cada especialidad',
            color:'#fff',
            font:{
              size:20,
            }
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  descargarPDFTurnosPorEspecialidad() {
    this.spinner=true;
    const DATA = document.getElementById('pdfTurnosPorEspecialidad');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        this.spinner=false;
        docResult.save(`turnos_por_especialidad.pdf`);
      });
  }

  descargarExcelTurnosPorEspecialidad() {
    const listaTurnos = [
      { especialidad: 'Pediatra', turnos: 0 },
      { especialidad: 'Odontologia', turnos: 0 },
      { especialidad: 'Traumatologia', turnos: 0 },
    ];
    this.listaTurnos.forEach((t) => {
      if (t.especialidad == 'Pediatra') {
        listaTurnos[0].turnos++;
      } else if (t.especialidad == 'Odontologia') {
        listaTurnos[1].turnos++;
      } else if (t.especialidad == 'Traumatologia') {
        listaTurnos[2].turnos++;
      }
    });
    this.exportAsExcelFile(listaTurnos, 'turnosPorEspecialidad');
  }

  // CHART CANTIDAD DE TURNOS POR DIA
  generarChartTurnosPorDia() {
    const ctx = (<any>document.getElementById('turnosPorDia')).getContext('2d');

    const colors = [
      '#71B340',
      '#414288',
      '#CB793A',
      '#DE639A',
      '#F7B801',
      '#950952',
      '#756D54',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    let listaTurnosPorDia = [0, 0, 0, 0, 0, 0];
    this.listaTurnos.forEach((t) => {
      if (new Date(t.fecha.seconds * 1000).getDay() == 1) {
        listaTurnosPorDia[0]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 2) {
        listaTurnosPorDia[1]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 3) {
        listaTurnosPorDia[2]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 4) {
        listaTurnosPorDia[3]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 5) {
        listaTurnosPorDia[4]++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 6) {
        listaTurnosPorDia[5]++;
      }
    });

    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: ['LUNES', 'MARTES', 'MIERCOLES', 'JUEVES', 'VIERNES', 'SABADO'],
        datasets: [
          {
            label: undefined,
            data: listaTurnosPorDia,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Turnos dados por cada dia de la semana.',
            color:'#fff',
            font:{
              size:20,
            }
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  descargarPDFTurnosPorDia() {
    this.spinner=true;
    const DATA = document.getElementById('pdfTurnosPorDia');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        this.spinner=false;
        docResult.save(`turnos_por_dia.pdf`);
      });
  }

  descargarExcelTurnosPorDia() {
    const listaTurnosPorDia = [
      {
        Fecha: new Date(),
        Lunes: 0,
        Martes: 0,
        Miercoles: 0,
        Jueves: 0,
        Viernes: 0,
        Sabado: 0,
      },
    ];
    this.listaTurnos.forEach((t) => {
      if (new Date(t.fecha.seconds * 1000).getDay() == 1) {
        //@ts-ignore
        listaTurnosPorDia[0].Lunes++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 2) {
        //@ts-ignore
        listaTurnosPorDia[0].Martes++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 3) {
        //@ts-ignore
        listaTurnosPorDia[0].Miercoles++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 4) {
        //@ts-ignore
        listaTurnosPorDia[0].Jueves++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 5) {
        //@ts-ignore
        listaTurnosPorDia[0].Viernes++;
      } else if (new Date(t.fecha.seconds * 1000).getDay() == 6) {
        //@ts-ignore
        listaTurnosPorDia[0].Sabado++;
      }
    });
    this.exportAsExcelFile(listaTurnosPorDia, 'turnosPorDia');
  }

  // CHART CANTIDAD DE TURNOS SOLICITADOS POR MEDICO
  generarChartTurnosSolicitadosPorMedico(listado: any[]) {
    const ctx = (<any>(
      document.getElementById('turnosSolicitadosPorMedico')
    )).getContext('2d');

    const colors = [
      '#71B340',
      '#414288',
      '#CB793A',
      '#DE639A',
      '#F7B801',
      '#950952',
      '#756D54',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    let listaTurnosSolicitadosPorMedico = [0, 0, 0];
    listado.forEach((t) => {
      if (
        t.especialista.mail == 'hohotemomma-5507@yopmail.com' &&
        t.estado == 'solicitado'
      ) {
        listaTurnosSolicitadosPorMedico[0]++;
      } else if (
        t.especialista.mail == 'papofacrisa-6675@yopmail.com' &&
        t.estado == 'solicitado'
      ) {
        listaTurnosSolicitadosPorMedico[1]++;
      } 
      // else if (
      //   t.especialista.email == 'juanperez@mail.com' &&
      //   t.estado == 'solicitado'
      // ) {
      //   listaTurnosSolicitadosPorMedico[2]++;
      // }
    });

    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Especialista 1', 'Especialista 2'],
        datasets: [
          {
            label: undefined,
            data: listaTurnosSolicitadosPorMedico,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Turnos que fueron solicitados en un lapso de tiempo a un medico.',
            color:'#fff',
            font:{
              size:20,
            }
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  descargarPDFTurnosSolicitadosPorMedico() {
    this.spinner=true;
    const DATA = document.getElementById('pdfTurnosSolicitadosPorMedico');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        this.spinner=false;
        docResult.save(`turnosSolicitadosPorMedico.pdf`);
      });
  }

  descargarExcelTurnosSolicitadosPorMedico() {
    let listaTurnosSolicitadosPorMedico = [
      {
        Fecha: new Date(),
        Especialista1: 0,
        Especialista2: 0,
      },
    ];
    if (this.btn15Dias) {
      this.listaTurnos.forEach((t) => {
        if (
          t.especialista.mail == 'hohotemomma-5507@yopmail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Especialista1++;
        } else if (
          t.especialista.mail == 'papofacrisa-6675@yopmail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Especialista2++;
        } 
        // else if (
        //   t.especialista.email == 'juanperez@mail.com' &&
        //   t.estado == 'solicitado'
        // ) {
        //   listaTurnosSolicitadosPorMedico[0].Juan_Perez++;
        // }
      });
    } else {
      const currentDate = new Date();
      const futureDate = new Date(currentDate.getTime() + 84600000 * 7);
      const listadoFiltrado: any[] = [];
      this.listaTurnos.forEach((t) => {
        if (
          new Date(t.fecha.seconds * 1000).getTime() <= futureDate.getTime() &&
          t.estado == 'solicitado'
        ) {
          listadoFiltrado.push(t);
        }
      });

      listadoFiltrado.forEach((t) => {
        if (
          t.especialista.mail == 'hohotemomma-5507@yopmail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Especialista1++;
        } else if (
          t.especialista.mail == 'papofacrisa-6675@yopmail.com' &&
          t.estado == 'solicitado'
        ) {
          listaTurnosSolicitadosPorMedico[0].Especialista2++;
        } 
        // else if (
        //   t.especialista.email == 'juanperez@mail.com' &&
        //   t.estado == 'solicitado'
        // ) {
        //   listaTurnosSolicitadosPorMedico[0].Juan_Perez++;
        // }
      });
    }
    this.exportAsExcelFile(
      listaTurnosSolicitadosPorMedico,
      'turnosSolicitadosPorMedico'
    );
  }

  filtrarTurnosPorDias(cantidadDias: number) {
    this.banderaChartSolicitados = false;
    if (cantidadDias == 7) {
      this.btn7Dias = true;
      this.btn15Dias = false;
    } else if (cantidadDias == 15) {
      this.btn7Dias = false;
      this.btn15Dias = true;
    }
    setTimeout(() => {
      this.banderaChartSolicitados = true;
      setTimeout(() => {
        const currentDate = new Date();
        const futureDate = new Date(
          currentDate.getTime() + 84600000 * cantidadDias
        );
        const listadoFiltrado: any[] = [];
        this.listaTurnos.forEach((t) => {
          if (
            new Date(t.fecha.seconds * 1000).getTime() <=
              futureDate.getTime() &&
            t.estado == 'solicitado'
          ) {
            listadoFiltrado.push(t);
          }
        });
        this.generarChartTurnosSolicitadosPorMedico(listadoFiltrado);
      }, 500);
    }, 100);
  }

  // CHART CANTIDAD DE TURNOS FINALIZADOS POR MEDICO
  generarChartTurnosFinalizadosPorMedico(listado: any[]) {
    const ctx = (<any>(
      document.getElementById('turnosFinalizadosPorMedico')
    )).getContext('2d');

    const colors = [
      '#71B340',
      '#414288',
      '#CB793A',
      '#DE639A',
      '#F7B801',
      '#950952',
      '#756D54',
    ];

    let i = 0;
    const turnosColores = this.listaTurnos.map(
      (_) => colors[(i = (i + 1) % colors.length)]
    );

    let listaTurnosFinalizadosPorMedico = [0, 0, 0];
    listado.forEach((t) => {
      if (
        t.especialista.mail == 'hohotemomma-5507@yopmail.com' &&
        t.estado == 'realizado'
      ) {
        listaTurnosFinalizadosPorMedico[0]++;
      } else if (
        t.especialista.mail == 'papofacrisa-6675@yopmail.com' &&
        t.estado == 'realizado'
      ) {
        listaTurnosFinalizadosPorMedico[1]++;
      } 
      // else if (
      //   t.especialista.email == 'juanperez@mail.com' &&
      //   t.estado == 'realizado'
      // ) {
      //   listaTurnosFinalizadosPorMedico[2]++;
      // }
    });

    this.chartPorEspecialidad = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Especialista 1', 'Especialista 2'],
        datasets: [
          {
            label: undefined,
            data: listaTurnosFinalizadosPorMedico,
            backgroundColor: turnosColores,
            borderColor: ['#000'],
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        layout: {
          padding: 20,
        },
        plugins: {
          legend: {
            position: 'top',
            display: true,
          },
          title: {
            display: true,
            text: 'Turnos finalizados por un medico en un lapso de tiempo.',
            color:'#fff',
            font:{
              size:20,
            }
          },
          datalabels: {
            color: '#fff',
            anchor: 'center',
            align: 'center',
            font: {
              size: 15,
              weight: 'bold',
            },
          },
        },
      },
    });
  }

  descargarExcelTurnosFinalizadosPorMedico() {
    let listaTurnosFinalizadosPorMedico = [
      {
        Fecha: new Date(),
        Especialista1: 0,
        Especialista2: 0,
      },
    ];
    if (this.btn15DiasFinalizado) {
      this.listaTurnos.forEach((t) => {
        if (
          t.especialista.mail == 'hohotemomma-5507@yopmail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Especialista1++;
        } else if (
          t.especialista.mail == 'papofacrisa-6675@yopmail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Especialista2++;
        } 
        // else if (
        //   t.especialista.email == 'juanperez@mail.com' &&
        //   t.estado == 'realizado'
        // ) {
        //   listaTurnosFinalizadosPorMedico[0].Juan_Perez++;
        // }
      });
    } else {
      const currentDate = new Date();
      const futureDate = new Date(currentDate.getTime() + 84600000 * 7);
      const listadoFiltrado: any[] = [];
      this.listaTurnos.forEach((t) => {
        if (
          new Date(t.fecha.seconds * 1000).getTime() <= futureDate.getTime() &&
          t.estado == 'realizado'
        ) {
          listadoFiltrado.push(t);
        }
      });

      listadoFiltrado.forEach((t) => {
        if (
          t.especialista.mail == 'hohotemomma-5507@yopmail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Especialista1++;
        } else if (
          t.especialista.mail == 'papofacrisa-6675@yopmail.com' &&
          t.estado == 'realizado'
        ) {
          listaTurnosFinalizadosPorMedico[0].Especialista2++;
        } 
        // else if (
        //   t.especialista.email == 'juanperez@mail.com' &&
        //   t.estado == 'realizado'
        // ) {
        //   listaTurnosFinalizadosPorMedico[0].Juan_Perez++;
        // }
      });
    }
    this.exportAsExcelFile(
      listaTurnosFinalizadosPorMedico,
      'turnosFinalizadosPorMedico'
    );
  }

  descargarPDFTurnosFinalizadosPorMedico() {
    this.spinner=true;
    const DATA = document.getElementById('pdfTurnosFinalizadosPorMedico');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        this.spinner=false;
        docResult.save(`turnosFinalizadosPorMedico.pdf`);
      });
  }

  filtrarTurnosPorDiasFinalizados(cantidadDias: number) {
    this.banderaChartFinalizados = false;
    if (cantidadDias == 7) {
      this.btn7DiasFinalizado = true;
      this.btn15DiasFinalizado = false;
    } else if (cantidadDias == 15) {
      this.btn7DiasFinalizado = false;
      this.btn15DiasFinalizado = true;
    }
    setTimeout(() => {
      this.banderaChartFinalizados = true;
      setTimeout(() => {
        const currentDate = new Date();
        const futureDate = new Date(
          currentDate.getTime() + 84600000 * cantidadDias
        );
        const listadoFiltrado: any[] = [];
        this.listaTurnos.forEach((t) => {
          if (
            new Date(t.fecha.seconds * 1000).getTime() <=
              futureDate.getTime() &&
            t.estado == 'realizado'
          ) {
            listadoFiltrado.push(t);
          }
        });
        this.generarChartTurnosFinalizadosPorMedico(listadoFiltrado);
      }, 500);
    }, 100);
  }

  // UTILES
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
}
