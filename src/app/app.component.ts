import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import  firebase  from 'firebase/compat/app';
import { environment } from 'src/environments/environment';
import { slideInAnimation } from './animaciones';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    slideInAnimation
  ]
})
export class AppComponent {
  title = 'tp2ClinicaOnline';

  ngOnInit(){
    firebase.initializeApp(environment.firebase);
  }

  prepareRoute(outlet: RouterOutlet) {
    return outlet && outlet.activatedRouteData && outlet.activatedRouteData["animation"];
  }
}
