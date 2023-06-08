import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BienvenidoComponent } from './pages/bienvenido/bienvenido.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { ActivateAdministradorGuard } from './guards/activate-administrador.guard';

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
    path:"usuarios", component:UsuariosComponent,canActivate:[ActivateAdministradorGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
