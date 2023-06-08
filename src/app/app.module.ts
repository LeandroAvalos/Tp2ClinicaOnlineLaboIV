import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BienvenidoComponent } from './pages/bienvenido/bienvenido.component';
import { NavBarComponent } from './componentes/nav-bar/nav-bar.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { RegistroComponent } from './pages/registro/registro.component';
import { FormAltaPacienteComponent } from './componentes/form-alta-paciente/form-alta-paciente.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire/compat';
import { FormAltaEspecialistaComponent } from './componentes/form-alta-especialista/form-alta-especialista.component';
import { ListadoEspecialidadesComponent } from './componentes/listado-especialidades/listado-especialidades.component';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { LoginComponent } from './pages/login/login.component';
import { ListadoUsuariosComponent } from './componentes/listado-usuarios/listado-usuarios.component';
import { UsuariosComponent } from './pages/usuarios/usuarios.component';
import { FormAltaAdministradorComponent } from './componentes/form-alta-administrador/form-alta-administrador.component';


@NgModule({
  declarations: [
    AppComponent,
    BienvenidoComponent,
    NavBarComponent,
    RegistroComponent,
    FormAltaPacienteComponent,
    FormAltaEspecialistaComponent,
    ListadoEspecialidadesComponent,
    LoginComponent,
    ListadoUsuariosComponent,
    UsuariosComponent,
    FormAltaAdministradorComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    AngularFireModule.initializeApp(environment.firebase),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage())
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
