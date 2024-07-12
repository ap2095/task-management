import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { from, Observable, of, throwError } from 'rxjs';
import { catchError, delay, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor( private router: Router) {}

  login(email: string, password: string): Observable<any> {
    const mockResponse = {
      result: true,
      payload: {
        id: 6,
        role: 'admin',
        username: 'admin@konsultera.in',
        first_name: 'Midhun',
        last_name: 'das',
        email: 'admin@konsultera.in',
        is_active: true,
        refresh: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcyMDc3NDk4NywiaWF0IjoxNzE5OTEwOTg3LCJqdGkiOiI4ZTAyYWVjMDBlYmU0OTRjYjIyNDczYmE0MWZkYjY5OSIsImlkIjo2fQ.Aq8RpLAlLKg2a_3QgIS4ACVKRk5oWQ8clWp4i5Sm_8Q',
        access: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzE5OTk3Mzg3LCJpYXQiOjE3MTk5MTA5ODcsImp0aSI6IjA4MjljYjcyODJjZDQ0YzBiMjY5NzBhYTRiNzkxZGQ3IiwiaWQiOjZ9.ahBDYQxZkAc8eG2c8Uij0RjZXcImy5WWxGKjB2EGaVk'
      },
      errors: null
    };

    // Simulate a network delay for realistic experience
    return of(mockResponse).pipe(
      delay(1000), // Simulate delay
      map(response => {
        if (email === 'admin@konsultera.in' && password === 'Pass@12345') {
          this.router.navigate(['/dashboard']);
          return response;
        } else {
          throw new Error('Invalid email or password');
        }
      }),
      catchError(error => {
        console.error('Login Error: ', error);
        return throwError(error); // Re-throw error to be handled by caller
      })
    );
  }
  setLoginDetail(data: any) {
    localStorage.setItem("currentUser", JSON.stringify(data));
    localStorage.setItem("accessToken", JSON.stringify(data.access));
  }
  logout() {
    localStorage.clear();
    this.router.navigate(['/auth/login']);
  }




}
