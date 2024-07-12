import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const isAdmin = currentUser?.role === 'admin';

    if (isAdmin) {
      return true;
    } else {
      this.router.navigate(['/login']); // Redirect to login if not an admin
      return false;
    }
  }
}

