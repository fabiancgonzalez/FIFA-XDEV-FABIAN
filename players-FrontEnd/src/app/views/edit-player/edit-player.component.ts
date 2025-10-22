import { Component, OnInit } from '@angular/core';
import { ModuloHTTPService } from '../../core/services/modulo-http.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

interface Player {
  id: number;
  long_name: string;
  nationality_name: string;
  overall: number;
  age: number;
  club_name: string;
  player_positions: string;
  fifa_version?: string;
  fifa_update?: string;
  player_face_url?: string;
}

interface ApiResponse {
  player?: Player;
  message?: string;
}

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit {
  editPlayerForm!: FormGroup;
  resultados: Player[] = [];
  selectedPlayerId: number | null = null;
  token: string | null = null;
  busquedaJugador: string = '';
  limiteDeJugadores: number = 10;
  busquedaRealizada: boolean = false;
  errorMessage: string | null = null;

  constructor(
    private moduloHttpService: ModuloHTTPService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.editPlayerForm = this.fb.group({
      long_name: ['', [Validators.required, Validators.minLength(2)]],
      nationality_name: ['', [Validators.required, Validators.minLength(2)]],
      overall: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^[0-9]+$')]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(60), Validators.pattern('^[0-9]+$')]],
      club_name: ['', Validators.required],
      player_positions: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    if (!this.token) {
      alert('Por favor inicie sesión para continuar');
      this.router.navigate(['/login']);
    }
  }

  private showFormErrors(): void {
    Object.keys(this.editPlayerForm.controls).forEach(key => {
      const control = this.editPlayerForm.get(key);
      if (control?.invalid) {
        control.markAsTouched();
      }
    });
    
    let errorMessage = 'Por favor, corrija los siguientes errores:\n';
    const formErrors = {
      long_name: '- El nombre es requerido y debe tener al menos 2 caracteres\n',
      nationality_name: '- La nacionalidad es requerida y debe tener al menos 2 caracteres\n',
      overall: '- La valoración debe ser un número entre 0 y 100\n',
      age: '- La edad debe ser un número entre 16 y 60\n',
      club_name: '- El club es requerido\n',
      player_positions: '- La posición es requerida\n'
    };

    Object.entries(formErrors).forEach(([field, message]) => {
      if (this.editPlayerForm.get(field)?.invalid) {
        errorMessage += message;
      }
    });
    
    alert(errorMessage);
  }

  private checkToken(): boolean {
    if (!this.token) {
      alert('No hay token de autenticación. Por favor, inicie sesión nuevamente.');
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  private handleSessionExpired(): void {
    this.token = null;
    localStorage.removeItem('token');
    alert('Sesión expirada. Por favor, inicie sesión nuevamente.');
    this.router.navigate(['/login']);
  }

  private handleError(action: string, err: any): void {
    console.error(`Error al ${action}:`, err);
    if (err.status === 401) {
      this.handleSessionExpired();
    } else if (err.status === 400) {
      alert(`Error de validación: ${err.error?.details || 'Los datos ingresados son inválidos'}`);
    } else if (err.status === 404) {
      alert('El jugador no fue encontrado. Por favor, refresque la página e intente de nuevo.');
    } else {
      alert(`Error al ${action}: ${err.error?.message || 'Error en el servidor'}`);
    }
  }

  buscarJugador(): void {
    if (!this.checkToken() || !this.busquedaJugador.trim()) {
      alert('Por favor ingrese un nombre para buscar');
      return;
    }

    if (!this.token) return;

    this.moduloHttpService.getPlayerByName(this.busquedaJugador, this.token, this.limiteDeJugadores).subscribe({
      next: (players: Player[]) => {
        this.resultados = players;
        this.busquedaRealizada = true;
        this.errorMessage = players.length === 0 ? 'No se encontraron jugadores con ese nombre' : null;
      },
      error: (err) => {
        this.resultados = [];
        this.busquedaRealizada = true;
        this.errorMessage = 'Error al buscar jugadores';
        this.handleError('buscar jugadores', err);
      }
    });
  }

  seleccionarJugador(player: Player): void {
    if (!player) return;
    
    this.selectedPlayerId = player.id;
    this.editPlayerForm.patchValue({
      long_name: player.long_name?.trim() || '',
      nationality_name: player.nationality_name?.trim() || '',
      overall: player.overall || 0,
      age: player.age || 18,
      club_name: player.club_name?.trim() || '',
      player_positions: player.player_positions?.trim() || ''
    });
  }

  guardarCambios(): void {
    if (!this.checkToken() || !this.selectedPlayerId || !this.editPlayerForm.valid) {
      this.showFormErrors();
      return;
    }

    try {
      const formValues = this.editPlayerForm.value;
      const overall = Number(formValues.overall);
      const age = Number(formValues.age);

      if (isNaN(overall) || overall < 0 || overall > 100 || isNaN(age) || age < 16 || age > 60) {
        alert('Por favor verifique los valores numéricos ingresados');
        return;
      }

      const playerData: Partial<Player> = {
        long_name: formValues.long_name?.trim(),
        nationality_name: formValues.nationality_name?.trim(),
        overall: overall,
        age: age,
        club_name: formValues.club_name?.trim(),
        player_positions: formValues.player_positions?.trim()
      };

      if (Object.values(playerData).some(val => val === '' || val === undefined)) {
        alert('Por favor, complete todos los campos sin dejar espacios en blanco.');
        return;
      }

      if (!this.token) {
        this.handleSessionExpired();
        return;
      }

      this.moduloHttpService.updatePlayer(this.selectedPlayerId, playerData, this.token).subscribe({
        next: (response: ApiResponse) => {
          if (response?.player) {
            this.resultados = this.resultados.map(p => 
              p.id === this.selectedPlayerId ? { ...p, ...response.player } : p
            );
            alert('Jugador actualizado con éxito');
            this.resetForm();
            this.buscarJugador();
          } else {
            alert('La actualización fue exitosa pero no se recibieron los datos actualizados');
          }
        },
        error: (err) => this.handleError('actualizar jugador', err)
      });
    } catch (error) {
      console.error('Error al procesar los datos:', error);
      alert('Error al procesar los datos del formulario');
    }
  }

  borrarJugador(player: Player): void {
    if (!this.checkToken() || !this.token || !player) return;

    if (window.confirm(`¿Está seguro que desea eliminar al jugador ${player.long_name}?`)) {
      this.moduloHttpService.deletePlayer(player.id, this.token).subscribe({
        next: () => {
          alert('El jugador fue eliminado con éxito');
          this.resultados = this.resultados.filter(p => p.id !== player.id);
          if (this.selectedPlayerId === player.id) {
            this.resetForm();
          }
        },
        error: (err) => this.handleError('eliminar jugador', err)
      });
    }
  }

  private resetForm(): void {
    this.editPlayerForm.reset();
    this.selectedPlayerId = null;
    this.busquedaJugador = '';
    Object.keys(this.editPlayerForm.controls).forEach(key => {
      this.editPlayerForm.get(key)?.setErrors(null);
    });
  }
}
