import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidoComponent } from './pages/bienvenido/bienvenido.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ActivateAdministradorGuard } from './guards/activate-administrador.guard';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { TurnosComponent } from './pages/turnos/turnos.component';

const routes: Routes = [
  {
    path:"", component:BienvenidoComponent
  },
  {
    path:"bienvenido", component:BienvenidoComponent
  },
  {
    path:"registro", component:RegistroComponent
  },
  {
    path:"login", component:LoginComponent
  },
  {
    path:"misTurnos", component:MisTurnosComponent,
  },
  {
    path:"solicitarTurno", component:SolicitarTurnoComponent,
  },
  {
    path:"miPerfil", component:MiPerfilComponent,
  },
  {
    path:"usuarios", component:UsuariosComponent,
  },
  {
    path:"turnos", component:TurnosComponent,
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
