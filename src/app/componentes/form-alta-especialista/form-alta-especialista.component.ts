import { Component, Input } from '@angular/core';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { SweetAlertService } from 'src/app/servicios/sweet-alert.service';
import { Storage, ref, uploadBytes, listAll, getDownloadURL } from '@angular/fire/storage';

@Component({
  selector: 'app-form-alta-especialista',
  templateUrl: './form-alta-especialista.component.html',
  styleUrls: ['./form-alta-especialista.component.css']
})
export class FormAltaEspecialistaComponent {

  @Input() especialidad?: any;

  nameValido: boolean = false;
  apellidoValido: boolean = false;
  dniValidado: boolean = false;
  emailValidado:boolean=false;
  edadValidada: boolean = false;
  claveValidada:boolean=false;
  claveRepetidaValidada:boolean=false;
  textoEspecialidades:string="";
  spinner:boolean=false;
  formFotos:any;
  captchaValido:boolean=false;


  nombre:string="";
  apellido:string="";
  edad:number=0;
  dni:string="";
  mail:string="";
  password:string="";
  claveRepetida:string="";
  captchaEscrito:string="";
  captcha: string = '';

  imageCount: number = 0;
  images: string[];

  constructor(
    private sweetalert:SweetAlertService,
    private firestore:FirestoreService,
    private storage: Storage) {
    this.images = [];
    this.captcha = this.generateRandomString(6);
  }
  handleFileInputChange(event: any) {
    const files: FileList = event.target.files;
  
    if (files.length !== 1) {
      this.sweetalert.showSuccessAlert('Debe subir 1 imagen', 'INCOMPLETO', 'warning');
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

  async guardaEspecialista()
  {
    if(this.nameValido && this.apellidoValido && this.edadValidada && this.dniValidado && this.emailValidado && this.claveValidada && this.claveRepetidaValidada && this.captchaValido)
    {
      this.spinner = true;
      let fotosTomadas: [] | any;
      const especialista = {
        nombre: this.nombre,
        apellido: this.apellido,
        edad: this.edad,
        especialidad: this.especialidad,
        dni: this.dni,
        mail: this.mail,
        password:this.password,
        fotos: fotosTomadas,
        aprobado: false
      };

      const fileInput = document.getElementById('fileInput') as HTMLInputElement;
      const files: FileList | null = fileInput.files;

      if (files) {

        if (files.length !== 1) {
          this.sweetalert.showSuccessAlert('Debe seleccionar 1 imágen', 'ERROR', 'error');
          this.spinner = false;
          return;
        }
    
        const urls: string[] = [];
    
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
    
          // Subir la imagen al almacenamiento
          const imgRef = ref(this.storage, `pacientes/${especialista.dni}/${file.name}`);
          await uploadBytes(imgRef, file);
    
          // Obtener la URL de la imagen subida
          const url = await getDownloadURL(imgRef);
          urls.push(url);
        }
    
        // Asignar las URLs al objeto paciente
        especialista.fotos = urls;

        this.formFotos = document.getElementById("fileInput");

        this.firestore.guardarEspecialista(especialista);
        
          this.spinner=false;
          this.limpiarForm();
      
        // this.sweetalert.showSuccessAlert('Especialista dado de alta exitosamente', 'EXITO', 'success');
      } 
    
    }
    else
    {
      this.sweetalert.showSuccessAlert('Ocurrio un error al dar de alta al especialista', 'ERROR', 'error');
    }
  }

  generateRandomString(num: number) {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result1 = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result1 += characters.charAt(
        Math.floor(Math.random() * charactersLength)
      );
    }
    return result1;
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
    this.nombre="";
    this.apellido="";
    this.edad=0;
    this.dni="";
    this.mail="";
    this.password="";
    this.claveRepetida="";
    this.textoEspecialidades = "";
  }

  // clickListado($event: any) {
  //   this.textoEspecialidades = $event.join(' - ');
  //   this.especialidad = $event;
  // }

  clickListado($event: any) {
    //@ts-ignore
    this.textoEspecialidades = $event.map((especialidad) => especialidad.nombre).join(' - ');
    this.especialidad = $event;
  }

  validarCaptcha() {
    if (this.captchaEscrito == this.captcha) {
      this.captchaValido = true;
    } else {
      this.captchaValido = false;
    }
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
