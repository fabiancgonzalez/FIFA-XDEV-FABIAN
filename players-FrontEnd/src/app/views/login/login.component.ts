import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { UserManagementComponent } from '../user-management/user-management.component';


   import * as CryptoJS from 'crypto-js';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  mensaje: string = '';
  showCreateUserForm: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  createUser() {
    this.showCreateUserForm = true;
  }

  onCreateUserSuccess() {
    this.showCreateUserForm = false;
    this.mensaje = 'Usuario creado exitosamente. Por favor, inicia sesión.';
  }


 
  onLogin() {

    this.authService.login(this.usuario, this.password).subscribe(
      (response: any) => {
       // localStorage.removeItem('token');
        localStorage.setItem('token', response.token); // Guarda el token en localStorage
        this.mensaje = 'Inicio de sesión exitoso!';
        this.router.navigate(['/home'])
      },
      (error) => {
        this.mensaje = 'Error al iniciar sesión: ' + error.error.mensaje; // Manejo de errores
      }
    );
  }
}
