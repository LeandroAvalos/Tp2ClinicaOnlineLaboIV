import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, getDoc, getDocs, updateDoc } from "@angular/fire/firestore";
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { SweetAlertService } from './sweet-alert.service';
import { combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private angularFirestore: AngularFirestore, private angularFireAuth: AngularFireAuth, private sweetalert:SweetAlertService,
    private firestore:Firestore) { }

  guardar(paciente: any) {
    this.angularFireAuth.createUserWithEmailAndPassword(paciente.mail,  paciente.password).then((data) =>{
      data.user?.sendEmailVerification();

      const uid = data.user?.uid;

      const documento = this.angularFirestore.doc('pacientes/' + uid);
  
      documento.set({
        uid: uid,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        edad: paciente.edad,
        dni: paciente.dni,
        obraSocial: paciente.obraSocial,
        mail: paciente.mail,
        password: paciente.password,
        fotos: paciente.fotos
      })
      .then(() => {
        this.sweetalert.showSuccessAlert("Paciente registrado con exito. Verifique su correo.", "Exito", "success");
      })
    })
    .catch((error)=>{
      const errorMessage = this.createMessage(error.code);
      this.sweetalert.showSuccessAlert(errorMessage, "Error", "error");
    })
  }

  guardarEspecialista(especialista: any) {
    this.angularFireAuth.createUserWithEmailAndPassword(especialista.mail,  especialista.password).then((data) =>{
      data.user?.sendEmailVerification();

      const uid = data.user?.uid;

      const documento = this.angularFirestore.doc('especialistas/' + uid);
  
      documento.set({
        uid: uid,
        nombre: especialista.nombre,
        apellido: especialista.apellido,
        edad: especialista.edad,
        dni: especialista.dni,
        especialidad: especialista.especialidad,
        mail: especialista.mail,
        password: especialista.password,
        fotos: especialista.fotos,
        aprobado: especialista.aprobado
      })
      .then(() => {
        this.sweetalert.showSuccessAlert("Especialista registrado con exito. Verifique su correo.", "Exito", "success");
      })
    })
    .catch((error)=>{
      const errorMessage = this.createMessage(error.code);
      this.sweetalert.showSuccessAlert(errorMessage, "Error", "error");
    })
  }

  guardarAdministrador(administrador: any) {
    this.angularFireAuth.createUserWithEmailAndPassword(administrador.mail,  administrador.password).then((data) =>{
      data.user?.sendEmailVerification();

      const uid = data.user?.uid;

      const documento = this.angularFirestore.doc('administradores/' + uid);
  
      documento.set({
        uid: uid,
        nombre: administrador.nombre,
        apellido: administrador.apellido,
        edad: administrador.edad,
        dni: administrador.dni,
        mail: administrador.mail,
        password: administrador.password,
        fotos: administrador.fotos
      })
      .then(() => {
        this.sweetalert.showSuccessAlert("Administrador registrado con exito. Verifique su correo.", "Exito", "success")
      })
    })
    .catch((error)=>{
      const errorMessage = this.createMessage(error.code);
      this.sweetalert.showSuccessAlert(errorMessage, "Error", "error");
    })
  }

  traerUsuarios() {
    const pacientesCollection = this.angularFirestore.collection<any>('pacientes').valueChanges();
    const especialidadesCollection = this.angularFirestore.collection<any>('especialistas').valueChanges();
    const administradoresCollection = this.angularFirestore.collection<any>('administradores').valueChanges();

    return combineLatest([pacientesCollection, especialidadesCollection,administradoresCollection]).pipe(
      map(([pacientes, especialidades, administradores]) => {
        // Aquí puedes realizar cualquier operación deseada con los datos de ambas colecciones

        // Puedes combinar los datos en un solo arreglo o estructura de datos si lo necesitas
        const datosCombinados = {
          pacientes,
          especialidades,
          administradores
        };

        return datosCombinados;
      })
    );
  }

  traerUsuariosCombinados() {
    const pacientesCollection = this.angularFirestore.collection<any>('pacientes').valueChanges();
    const especialidadesCollection = this.angularFirestore.collection<any>('especialistas').valueChanges();
    const administradoresCollection = this.angularFirestore.collection<any>('administradores').valueChanges();

    return combineLatest([pacientesCollection, especialidadesCollection, administradoresCollection]).pipe(
      map(([pacientes, especialidades, administradores]) => {

        const datosCombinados = {
          pacientes,
          especialidades,
          administradores
        };

        const arrayUsuarios: any[]=[];

        for (const unUser of datosCombinados.pacientes) {
          arrayUsuarios.push(unUser);
        }
        for (const especialidad of datosCombinados.especialidades) {
          arrayUsuarios.push(especialidad);
        }
        for (const administrador of datosCombinados.administradores) {
          arrayUsuarios.push(administrador);
        }

        return arrayUsuarios;
      })
    );
  }

  traerEspecialidades() {
    const collection = this.angularFirestore.collection<any>('especialidades');
    return collection.valueChanges();
  }

  setEspecialidad(nombres: any) {
    const documento = this.angularFirestore.doc('especialidades/' + this.angularFirestore.createId());
    const uid = documento.ref.id;

    documento.set({
      uid: uid,
      nombre: nombres
    });
  }

  traerAdmin() {
    const collection = this.angularFirestore.collection<any>('administradores');
    return collection.valueChanges();
  }

  traerEsp() {
    const collection = this.angularFirestore.collection<any>('especialistas');
    return collection.valueChanges();
  }

  traer() {
    const collection = this.angularFirestore.collection<any>('pacientes');
    return collection.valueChanges();
  }

  traerUsuario(uid: string) {
    console.log("combinados ",this.traerUsuariosCombinados());
    return this.traerUsuariosCombinados().pipe(
      map((usuarios: any[]) => {
        return usuarios.find(user => user.uid === uid);
      })
    );
  }
  
  updateEspecialista(userMod: any) {
    this.angularFirestore
      .doc<any>(`especialistas/${userMod.uid}`)
      .update(userMod)
      .then(() => { })
      .catch((error) => {
      });
  }


  private createMessage(errorCode: string): string {
    let message: string = '';
    switch (errorCode) {
      case 'auth/internal-error':
        message = 'Los campos estan vacios';
        break;
      case 'auth/operation-not-allowed':
        message = 'La operación no está permitida.';
        break;
      case 'auth/email-already-in-use':
        message = 'El email ya está registrado.';
        break;
      case 'auth/invalid-email':
        message = 'El email no es valido.';
        break;
      case 'auth/weak-password':
        message = 'La contraseña debe tener al menos 6 caracteres';
        break;
      default:
        message = 'Error al crear el usuario.';
        break;
    }

    return message;
  }

  //TURNOS
  createTurnList(turn: any) {
    this.angularFirestore
      .collection<any>('turnos')
      .add(turn)
      .then((data) => {
        this.angularFirestore.collection('turnos').doc(data.id).set({
          id: data.id,
          especialista: turn.especialista,
          turnos: turn.turnos,
        });
      });
  }

  getTurnList() {
    const collection = this.angularFirestore.collection<any>('turnos');
    return collection.valueChanges();
  }

  updateTurnList(turn: any) {
    this.angularFirestore
      .doc<any>(`turnos/${turn.id}`)
      .update(turn)
      .then(() => { })
      .catch((error) => {
        console.log(error.message);
        this.sweetalert.showSuccessAlert('Ocurrio un error', 'Administrador', 'error');
      });
  }

  createHistorialClinico(turn: any) {
    return this.angularFirestore
      .collection<any>('historialesClinicos')
      .add(turn)
      .then((data) => {
        this.angularFirestore
          .collection('historialesClinicos')
          .doc(data.id)
          .set({
            id: data.id,
            especialidad: turn.especialidad,
            especialista: turn.especialista,
            paciente: turn.paciente,
            fecha: turn.fecha,
            detalle: turn.detalle,
            detalleAdicional: turn.detalleAdicional,
          });
      })
      .catch((error) => {
        throw error;
      });
  }

  getHistorialesClinicos() {
    const collection = this.angularFirestore.collection<any>(
      'historialesClinicos'
    );
    return collection.valueChanges();
  }

}


