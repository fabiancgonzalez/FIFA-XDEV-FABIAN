import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  role?: string;
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  @Input() showForm: boolean = false;
  @Input() showUserList: boolean = true;
  @Output() closeForm = new EventEmitter<void>();
  @Output() userCreated = new EventEmitter<void>();
  userForm: FormGroup;
  users: User[] = [];
  editingUser: User | null = null;
  errorMessage: string = '';
  successMessage: string = '';

  constructor(
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.showUserList) {
      this.loadUsers();
    }
  }

  loadUsers(): void {
    if (!this.showUserList) return;
    
    this.authService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar usuarios: ' + error.message;
      }
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.errorMessage = 'Por favor complete todos los campos correctamente';
      return;
    }

    const userData = this.userForm.value;
    
    if (this.editingUser) {
      // Update existing user
      this.authService.updateUser(this.editingUser.id!, userData).subscribe({
        next: () => {
          this.successMessage = 'Usuario actualizado exitosamente';
          this.loadUsers();
          this.resetForm();
        },
        error: (error) => {
          this.errorMessage = 'Error al actualizar usuario: ' + error.message;
        }
      });
    } else {
      // Create new user
      this.authService.createUser(userData).subscribe({
        next: () => {
          this.successMessage = 'Usuario creado exitosamente';
          this.loadUsers();
          this.resetForm();
          this.userCreated.emit();
          this.closeForm.emit();
        },
        error: (error) => {
          this.errorMessage = 'Error al crear usuario: ' + error.message;
        }
      });
    }
  }

  editUser(user: User): void {
    this.editingUser = user;
    this.userForm.patchValue({
      username: user.username,
      email: user.email,
      role: user.role || 'user'
    });
    // Clear password field when editing
    this.userForm.get('password')?.setValidators([]);
    this.userForm.get('password')?.updateValueAndValidity();
  }

  deleteUser(userId: number): void {
    if (confirm('¿Está seguro que desea eliminar este usuario?')) {
      this.authService.deleteUser(userId).subscribe({
        next: () => {
          this.successMessage = 'Usuario eliminado exitosamente';
          this.loadUsers();
        },
        error: (error) => {
          this.errorMessage = 'Error al eliminar usuario: ' + error.message;
        }
      });
    }
  }

  resetForm(): void {
    this.editingUser = null;
    this.userForm.reset({ role: 'user' });
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
    this.errorMessage = '';
    this.successMessage = '';
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
  }
}