import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // VER DE CAMBIAR POR EL TEMA DEL backend

  constructor(private http: HttpClient) { }

  // Método para realizar el login


  /*const hashedPassword = CryptoJS.MD5(this.password).toString();
login(usuario: string, password: string): Observable<any> {
  localStorage.removeItem('token');
  return this.http.post(`${this.apiUrl}/auth/login`, { usuario, password });
}

---------------------esta linea verrrrrrrr-------------
    return this.http.post(`${this.apiUrl}/login`, { usuario, password: CryptoJS.MD5(password).toString() });

  */

  login(usuario: string, password: string): Observable<any> {
      localStorage.removeItem('token');
    return this.http.post(`${this.apiUrl}/login`, { usuario, password });
  }


}
