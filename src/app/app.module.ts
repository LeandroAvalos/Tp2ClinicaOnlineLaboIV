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
import { TurnosComponent } from './pages/turnos/turnos.component';
import { SolicitarTurnoComponent } from './pages/solicitar-turno/solicitar-turno.component';
import { MisTurnosComponent } from './pages/mis-turnos/mis-turnos.component';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';
import { PacientesComponent } from './pages/pacientes/pacientes.component';
import { GraficosComponent } from './pages/graficos/graficos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DeslizarCardsDirective } from './directivas/deslizar-cards.directive';
import { InteriorCardDirective } from './directivas/interior-card.directive';
import { CambioColorPdfExcelDirective } from './directivas/cambio-color-pdf-excel.directive';
import { DiaYHoraPipe } from './pipes/dia-yhora.pipe';
import { CapitalizarPalabrasPipe } from './pipes/capitalizar-palabras.pipe';
import { FechaPipe } from './pipes/fecha.pipe';


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
    FormAltaAdministradorComponent,
    TurnosComponent,
    SolicitarTurnoComponent,
    MisTurnosComponent,
    MiPerfilComponent,
    PacientesComponent,
    GraficosComponent,
    DeslizarCardsDirective,
    InteriorCardDirective,
    CambioColorPdfExcelDirective,
    DiaYHoraPipe,
    CapitalizarPalabrasPipe,
    FechaPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
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
