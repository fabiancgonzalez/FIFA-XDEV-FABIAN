import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  showUserManagement: boolean = false;
  currentUser: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    // Obtener información del usuario desde localStorage o servicio de auth
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decodificar el token para obtener información del usuario
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.currentUser = payload.username || 'Usuario';
      } catch (error) {
        this.currentUser = 'Usuario';
      }
    } else {
      this.currentUser = 'Usuario';
    }
  }

  toggleUserManagement() {
    this.showUserManagement = !this.showUserManagement;
  }
}
