import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginService } from '../servicios/login.service';
import { SweetAlertService } from '../servicios/sweet-alert.service';

@Injectable({
  providedIn: 'root'
})
export class ActivateAdministradorGuard implements CanActivate {
  constructor(private loginService:LoginService, private router:Router, private sweetalert:SweetAlertService)
  {

  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.loginService.estaLogueado() && this.loginService.esAdmin == true)
      {
        return true;
      }
      else
      {
        this.sweetalert.showSuccessAlert("Necesita permisos de administrador para entrar.", "Ocurrio un error", "error");
        this.router.navigate(['/bienvenido']);
        return false;
      }
  }
  
}
