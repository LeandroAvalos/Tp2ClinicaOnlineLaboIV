import { Component, Input } from '@angular/core';
import { FirestoreService } from 'src/app/servicios/firestore.service';
import { LoginService } from 'src/app/servicios/login.service';
import { SweetAlertService } from 'src/app/servicios/sweet-alert.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  @Input() usuario?: any;

  emailRelleno:string = "";
  passwordRelleno:string = "";
  arrayUsuario:any[]=[];
  fotoUsuario:string="";
  perfinUsuario:string="";

  arrayDePacientes:any[]=[];
  arrayDeEspecialista:any[]=[];
  arrayDeAdministradores:any[]=[];

  correoValido: boolean = false;
  passValido: boolean = false;
  nameValido: boolean = false;

  constructor(private loginService:LoginService, private firestore:FirestoreService, private sweetalert:SweetAlertService){

  }

  ngOnInit() {
    this.arrayUsuario=[];
    
    this.firestore.traerUsuarios().subscribe(usuarios => {
      for (const unUser of usuarios.pacientes) {
        this.arrayUsuario.push(unUser);
      }
      for (const especialidad of usuarios.especialidades) {
        this.arrayUsuario.push(especialidad);
      }
      for (const administrador of usuarios.administradores) {
        this.arrayUsuario.push(administrador);
      }
    });

    
  }

  clickListadoUsuarios($event: any) {
    this.usuario = $event;
    this.rellenarUsuarioYContrasenia(this.usuario.mail,this.usuario.password);
  }

  obtenerUser(emailIngresado:string){
    let nombreDelUsuario="";
    for (const unUsuario of this.arrayUsuario) {
      if(unUsuario.mail==emailIngresado){
        return unUsuario;
      }
    }
    return nombreDelUsuario;
  }

  encontrarNombreUsuario(emailUsuario:any)
  {
    let nombreDelUsuario="";
    for (const usuario of this.arrayUsuario) {
      if(usuario.mail==emailUsuario){
        nombreDelUsuario=usuario.nombre;
        if(usuario.hasOwnProperty("obraSocial"))
        {
          this.perfinUsuario="paciente";
          this.fotoUsuario=usuario.fotos[0];
        }
        else if(usuario.hasOwnProperty("especialidad")){
          this.perfinUsuario="especialista";
          this.fotoUsuario=usuario.fotos[0];
        }
        else{
          this.perfinUsuario="administrador";
          this.fotoUsuario=usuario.fotos[0];
        }
        break;
      }
    }
    return nombreDelUsuario;
  }

  login()
  {
    const userLog =this.obtenerUser(this.emailRelleno);
    if(userLog.hasOwnProperty("aprobado")){
      if(userLog.aprobado)
      {
        // let nombreUsuario = this.encontrarNombreUsuario(this.emailRelleno);
        this.loginService.login(this.emailRelleno,this.passwordRelleno, userLog);

      }
      else{

        this.sweetalert.showSuccessAlert("Su cuenta no ha sido verificado por el Admin", "Error", "error");
      } 
    }
    else
    {
      let nombreUsuario = this.encontrarNombreUsuario(this.emailRelleno);
      this.loginService.login(this.emailRelleno,this.passwordRelleno, userLog);
    }
  }

  rellenarUsuarioYContrasenia(email:string,password:string)
  {
    this.emailRelleno = email;
    this.passwordRelleno = password;
    this.correoValido = true;
    this.passValido = true;
  }


  validarCorreo() {
    if (this.emailRelleno.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)) {
      this.correoValido = true;
    } else {
      this.correoValido = false;
    }
  }

  validarPass() {
    if (this.passwordRelleno.match(/[0-9a-zA-Z]{6,}/)) {
      this.passValido = true;
    } else {
      this.passValido = false;
    }
  }
}
