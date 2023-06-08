import { Component, EventEmitter, Output } from '@angular/core';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { LoginService } from 'src/app/servicios/login.service';
import { SweetAlertService } from 'src/app/servicios/sweet-alert.service';

@Component({
  selector: 'app-listado-usuarios',
  templateUrl: './listado-usuarios.component.html',
  styleUrls: ['./listado-usuarios.component.css']
})
export class ListadoUsuariosComponent {

  @Output() botonClickeado = new EventEmitter<any>();
  arrayDePacientes:any[]=[];
  arrayDeEspecialista:any[]=[];
  arrayDeAdministradores:any[]=[];
  spinner:boolean=false;
  constructor(private serviceAlert:SweetAlertService, private authlogin:LoginService, private firestore:FirestoreService) {

  }
  ngOnInit(): void {
    // this.spinner=true;

      this.firestore.traerPacientes().subscribe(usuarios => {
        
        this.arrayDePacientes = usuarios;
      });
      this.firestore.traerEspecialistas().subscribe(usuarios => {
        
        this.arrayDeEspecialista = usuarios;
      });
      this.firestore.traerAdministradores().subscribe(usuarios => {
        
        this.arrayDeAdministradores = usuarios;
        // this.spinner=false;
      });

  }
  clickListado(usuario: any) {
    this.botonClickeado.emit(usuario);
  }
}
