import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import  firebase  from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getAuth, signOut } from "firebase/auth";
import { SweetAlertService } from './sweet-alert.service';
import { addDoc, collection, collectionData, Firestore, getDoc, getDocs, updateDoc } from "@angular/fire/firestore";
import { AngularFireAuth } from '@angular/fire/compat/auth';

import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private router:Router, private sweetAlert:SweetAlertService, private firestore:Firestore, private firestoreService:FirestoreService) { 

  }

  token:string = "";
  seLogueo : boolean = false;
  email:string = "";
  nombreUsuario:string = "";
  fotoUsuario:string="";
  arrayDeAdministradores:any[]=[];
  esAdmin:boolean=false;


  async login(email:string | any, password:string | any, usuario?:any)
  {
    await firebase.auth().signInWithEmailAndPassword(email,password).then(

      response=>(
        firebase.auth().currentUser?.getIdToken().then(
          token=>{
            if(firebase.auth().currentUser?.emailVerified)
            {
              this.token = token;
              this.sweetAlert.showSuccessAlert("Se inicio sesión con exito", "Sesión iniciada", "success");
              this.seLogueo = true;
              this.email = email;
              console.log(usuario);
              if(!usuario.hasOwnProperty("obraSocial") && !usuario.hasOwnProperty("especialidad"))
              {
                this.esAdmin=true;
              }
     
              if(usuario.nombre!=""){
                this.nombreUsuario = usuario.nombre;
            
              }
           
              if(usuario.fotos!="")
              {
                this.fotoUsuario = usuario.fotos;
              }
              this.router.navigate(['/bienvenido']);
            }
            else
            {
              this.sweetAlert.showSuccessAlert("Verifique su correo", "Error", "error");
             
            }
          }
        )
      )
    ).catch(
      error=>(
        this.sweetAlert.showSuccessAlert("No se ha podido iniciar sesión", "Ocurrio un problema.", "error")
      )
    );

  }

  // guardarLog(nombreUsuario:any)
  // {
  //   const col = collection(this.firestore, 'logsUsuarios')
  //   return addDoc(col, {fechaLogeoUsuario: moment(new Date()).format('DD-MM-YYYY HH:mm:ss'), nombreUsuario: nombreUsuario});
  // }

  estaLogueado(){
    return this.token;
  }

  logout()
  {
    this.email = "";
    this.nombreUsuario = "";
    this.fotoUsuario = "";
    this.esAdmin = false;
    firebase.auth().signOut();
    this.setToken("");
    this.seLogueo = false;
    this.sweetAlert.showSuccessAlert("Sesión cerrada con exito", "Sesión Cerrada", "success");
    this.router.navigate(['/bienvenido']);
  }

  getEmailUsuario(){
    return firebase.auth().currentUser?.email;
  }

  getIdToken()
  {
    return this.token;
  }

  setToken(token:string)
  {
    this.token = token;
  }

}
