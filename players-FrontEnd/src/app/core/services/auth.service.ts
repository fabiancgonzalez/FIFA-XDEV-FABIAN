import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/auth'; // VER DE CAMBIAR POR EL TEMA DEL backend

  constructor(private http: HttpClient) { }

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
