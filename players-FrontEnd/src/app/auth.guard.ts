import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('token');

    if (token) {
      return true; // Permite el acceso
    } else {
      this.router.navigate(['/login']); // Redirige al login si no hay token
      return false;
    }
  }
}
