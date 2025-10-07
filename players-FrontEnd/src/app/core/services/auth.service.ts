import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // Cambia esto según tu backend

  constructor(private http: HttpClient) { }

  // Método para realizar el login
  login(usuario: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { usuario, password });
  }


}
