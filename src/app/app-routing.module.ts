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
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { GraficosComponent } from './pages/graficos/graficos.component';

const routes: Routes = [
  
  {
    path:"bienvenido", component:BienvenidoComponent, data: { animation: 'Home' }
  },
  {
    path:"registro", component:RegistroComponent, data: { animation: 'Registro' }
  },
  {
    path:"login", component:LoginComponent, data: { animation: 'Login' }
  },
  {
    path:"misTurnos", component:MisTurnosComponent,
  },
  {
    path:"solicitarTurno", component:SolicitarTurnoComponent,
  },
  {
    path:"miPerfil", component:MiPerfilComponent, data: {animation: "MiPerfil"}
  },
  {
    path:"rutaParaElAdmin", component:UsuariosComponent, children: [{path:'usuarios',component:UsuariosComponent}]
  },
  {
    path:"rutaParaElAdmin", component:TurnosComponent, children: [{path:'turnos',component:TurnosComponent}]
  },
  {
    path:"pacientes", component:PacientesComponent,
  },
  {
    path:"rutaParaElAdmin", component:GraficosComponent, children: [{path:'graficos',component:GraficosComponent}]
  },
  {
    path:"", component:BienvenidoComponent, data: { animation: 'Home' }
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
