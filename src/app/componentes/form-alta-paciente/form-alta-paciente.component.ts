import { Component } from '@angular/core';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { SweetAlertService } from 'src/app/servicios/sweet-alert.service';

@Component({
  selector: 'app-form-alta-paciente',
  templateUrl: './form-alta-paciente.component.html',
  styleUrls: ['./form-alta-paciente.component.css']
})
export class FormAltaPacienteComponent {

  nameValido: boolean = false;
  apellidoValido: boolean = false;
  dniValidado: boolean = false;
  emailValidado:boolean=false;
  edadValidada: boolean = false;
  claveValidada:boolean=false;
  claveRepetidaValidada:boolean=false;
  obraSocialValidada: boolean = false;
  nombre:string="";
  apellido:string="";
  edad:number=0;
  dni:string="";
  mail:string="";
  password:string="";
  claveRepetida:string="";
  obraSocial:string="";
  spinner:boolean=false;
  formFotos:any;

  imageCount: number = 0;
  images: string[];

  constructor(
   
    private sweetalert:SweetAlertService,
    private firestore:FirestoreService,
    private storage: Storage) {
    this.images = [];
  }

  async guardaPaciente()
  {
    if(this.nameValido && this.apellidoValido && this.obraSocialValidada && this.edadValidada && this.dniValidado && this.emailValidado && this.claveValidada && this.claveRepetidaValidada)
    {
      this.spinner=true;
      let fotosTomadas: [] | any;
      const paciente = {
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        obraSocial: this.obraSocial,
        dni: this.dni,
        mail: this.mail,
        password:this.password,
        fotos: fotosTomadas
      };

      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      const files: FileList | null = fileInput.files;

      if (files) {

        if (files.length !== 2) {
          this.sweetalert.showSuccessAlert('Debe seleccionar 2 imágenes', 'ERROR', 'error');
          this.spinner = false;
          return;
        }
    
        const urls: string[] = [];
    
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
    
          // Subir la imagen al almacenamiento
          const imgRef = ref(this.storage, `pacientes/${paciente.dni}/${file.name}`);
          await uploadBytes(imgRef, file);
    
          // Obtener la URL de la imagen subida
          const url = await getDownloadURL(imgRef);
          urls.push(url);
        }
    
        // Asignar las URLs al objeto paciente
        paciente.fotos = urls;
      
        this.formFotos = document.getElementById("fileInput");
        
        this.firestore.guardar(paciente);

          this.spinner=false;
          this.limpiarForm();
    
        // this.sweetalert.showSuccessAlert('Paciente dado de alta exitosamente', 'EXITO', 'success');
      } 
    
    }
    else
    {
      this.sweetalert.showSuccessAlert('Ocurrio un error al dar de alta al paciente', 'ERROR', 'error');
    }
  }

  handleFileInputChange(event: any) {
    const files: FileList = event.target.files;

    if (files.length !== 2) {
      this.sweetalert.showSuccessAlert('Debe subir 2 imagenes', 'INCOMPLETO', 'warning');
      this.spinner = false;
      return;
    }

    this.images = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imageUrl = URL.createObjectURL(file);
      this.images.push(imageUrl);
    }
  }

  limpiarForm()
  {
    this.formFotos.value = "";
    this.images = [];
    this.nameValido= false;
    this.apellidoValido = false;
    this.dniValidado = false;
    this.emailValidado=false;
    this.edadValidada = false;
    this.claveValidada=false;
    this.claveRepetidaValidada=false;
    this.obraSocialValidada = false;
    this.nombre="";
    this.apellido="";
    this.edad=0;
    this.dni="";
    this.mail="";
    this.password="";
    this.claveRepetida="";
    this.obraSocial=""; 
  }

  validarName() {
    if (this.nombre.match(/[a-zA-Z]/) && this.nombre.length<15 && this.nombre.length>2) {
      this.nameValido = true;
    } else {
      this.nameValido = false;
    }
  }

  validarApellido() {
    if (this.apellido.match(/[a-zA-Z]/) && this.apellido.length<15 && this.apellido.length>2) {
      this.apellidoValido = true;
    } else {
      this.apellidoValido = false;
    }
  }

  validarObraSocial() {
    if (this.obraSocial.match(/[a-zA-Z]/) && this.obraSocial.length<20 && this.obraSocial.length>3) {
      this.obraSocialValidada = true;
    } else {
      this.obraSocialValidada = false;
    }
  }

  validarPass() {
    if (this.password.match(/[0-9a-zA-Z]{6,}/)) {
      this.claveValidada = true;
    } else {
      this.claveValidada = false;
    }
  }

  validarPassRepetido() {
    if (this.claveRepetida.match(/[0-9a-zA-Z]{6,}/) && this.claveRepetida == this.password) {
      this.claveRepetidaValidada = true;
    } else {
      this.claveRepetidaValidada = false;
    }
  }

  validarCorreo() {
    if (this.mail.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)) {
      this.emailValidado = true;
    } else {
      this.emailValidado = false;
    }
  }

  validarEdad() {
    if (this.edad>17 && this.edad<100){
      this.edadValidada = true;
    } else {
      this.edadValidada = false;
    }
  }

  validarDni() {
    if (this.dni.match(/[1-9]/) && (this.dni.length==7 || this.dni.length==8)){
      this.dniValidado = true;
    } else {
      this.dniValidado = false;
    }
  }

}
