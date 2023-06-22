import { Component } from '@angular/core';
import { FirestoreService } from 'src/app/servicios/firestore.service';

@Component({
  selector: 'app-bienvenido',
  templateUrl: './bienvenido.component.html',
  styleUrls: ['./bienvenido.component.css']
})
export class BienvenidoComponent {
  arrayDePacientes:any[]=[];
  arrayDeEspecialista:any[]=[];
  arrayDeAdministradores:any[]=[];

  constructor(private firestore:FirestoreService){}

  ngOnInit(){
    this.arrayDePacientes=[];
    this.arrayDeEspecialista=[];
    this.arrayDeAdministradores=[];

    this.firestore.traer().subscribe(usuarios => {
        
      this.arrayDePacientes = usuarios;
    });
    this.firestore.traerEsp().subscribe(usuarios => {
      
      this.arrayDeEspecialista = usuarios;
    });
    this.firestore.traerAdmin().subscribe(usuarios => {
      
      this.arrayDeAdministradores = usuarios;
      // this.spinner=false;
    });
  }
}
