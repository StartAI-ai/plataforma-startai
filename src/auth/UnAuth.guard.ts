import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UnAuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    // Verifica se o usuário está autenticado através do localStorage
    if (typeof window !== 'undefined' && window.localStorage) {
        const userData = localStorage.getItem('userData');
  
        if (!userData) {
          return true;  // O usuário está autenticado
        } else {
          this.router.navigate(['/home']);
          return false;  // O usuário não está autenticado
        }
    }

    return false;
  }
}
