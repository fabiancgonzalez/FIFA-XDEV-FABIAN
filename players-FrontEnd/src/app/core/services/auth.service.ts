import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // VER DE CAMBIAR POR EL TEMA DEL backend

  constructor(private http: HttpClient) { }

  private getHeaders(requiresAuth: boolean = true): HttpHeaders {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    if (requiresAuth) {
      const token = localStorage.getItem('token');
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    
    return headers;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`, { headers: this.getHeaders(true) });
  }

  createUser(userData: User): Observable<User> {
    const registerData = {
      username: userData.username,
      email: userData.email,
      password: userData.password,
      role: userData.role || 'users'  // Using 'users' to match the backend ENUM
    };
    return this.http.post<User>(`${this.apiUrl}/register`, registerData, { headers: this.getHeaders(false) });
  }

  updateUser(userId: number, userData: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}`, userData, { headers: this.getHeaders(true) });
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${userId}`, { headers: this.getHeaders(true) });
  }

  // Método para realizar el login


  login(usuario: string, password: string): Observable<any> {
    // Primero eliminamos cualquier token existente
    localStorage.removeItem('token');
    
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });

    const body = {
      usuario,
      password
    };

    console.log('Enviando solicitud de login:', {
      url: `${this.apiUrl}/login`,
      headers: headers.keys(),
      bodyKeys: Object.keys(body)
    });
    
    // Agregar withCredentials: true para asegurar que las cookies se envíen
    return this.http.post(`${this.apiUrl}/login`, body, { 
      headers, 
      withCredentials: true,
      observe: 'response'  // Esto nos permite ver la respuesta completa, incluyendo headers
    }).pipe(
      map((response: any) => {
        console.log('Respuesta del servidor:', {
          status: response.status,
          headers: response.headers.keys(),
          body: response.body
        });
        return response.body;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error('Error en la petición de login:', {
          status: error.status,
          message: error.message,
          error: error
        });
        throw error;
      })
    );
  }


}
