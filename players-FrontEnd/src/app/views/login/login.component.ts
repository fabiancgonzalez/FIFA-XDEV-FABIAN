import { Component } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  usuario: string = '';
  password: string = '';
  mensaje: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  onLogin() {
    this.authService.login(this.usuario, this.password).subscribe(
      (response: any) => {
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
