import { Component, OnInit } from '@angular/core';
import { ModuloHTTPService } from '../../core/services/modulo-http.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrl: './edit-player.component.scss'
})
export class EditPlayerComponent implements OnInit {
  constructor(private moduloHttpService: ModuloHTTPService, private fb: FormBuilder) {
    //creación del formulario
    this.editPlayerForm = this.fb.group({
      long_name: ['', [Validators.required, Validators.minLength(2)]],
      nationality_name: ['', [Validators.required, Validators.minLength(2)]],
      overall: ['', [
        Validators.required, 
        Validators.min(0), 
        Validators.max(100),
        Validators.pattern('^[0-9]+$')
      ]],
      age: ['', [
        Validators.required, 
        Validators.min(16), 
        Validators.max(60),
        Validators.pattern('^[0-9]+$')
      ]],
      club_name: ['', Validators.required],
      player_positions: ['', Validators.required],
    });
  }

  busquedaJugador = '';
  resultados: any[] = [];
  busquedaRealizada = false;
  editPlayerForm: FormGroup;
  limiteDeJugadores: number = 5;
  selectedPlayerId: number | null = null;
  errorMessage: string | null = null;
  token: any = ''
  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }
 

  buscarJugador(): void {
    this.moduloHttpService.getPlayerByName(this.busquedaJugador, this.token, this.limiteDeJugadores).subscribe({
      next: (players) => {
        this.resultados = players;
        this.busquedaRealizada = true;
       
       
      },
      error: (err) => {
        this.resultados = [];
        this.busquedaRealizada = true;
        console.log(err);
      }
      
    });
  }

  seleccionarJugador(player: any): void {
    this.selectedPlayerId = player.id;
    
    this.editPlayerForm.patchValue({
      long_name: player.long_name,
      nationality_name: player.nationality_name,
      overall: player.overall,
      age: player.age,
      club_name: player.club_name,
      player_positions: player.player_positions,
      
    });
  }

  guardarCambios(): void {
    if (this.editPlayerForm.valid && this.selectedPlayerId !== null) {
      console.log('Datos a enviar:', this.editPlayerForm.value); // Para debug
      
      // Crear una copia de los datos del formulario
      const playerData = {
        ...this.editPlayerForm.value,
        // Asegurarse de que los campos numéricos sean números
        overall: parseInt(this.editPlayerForm.value.overall),
        age: parseInt(this.editPlayerForm.value.age)
      };

      this.moduloHttpService.updatePlayer(this.selectedPlayerId, playerData, this.token).subscribe({
        next: (response) => {
          console.log('Respuesta del servidor:', response); // Para debug
          alert('Jugador actualizado con éxito');
          
          // Actualizar la lista de resultados con el jugador modificado
          this.resultados = this.resultados.map(player => 
            player.id === this.selectedPlayerId ? { ...player, ...playerData } : player
          );
          
          // Limpiar el formulario y los estados
          this.busquedaJugador = '';
          this.editPlayerForm.reset();
          this.selectedPlayerId = null;
        },
        error: (err) => {
          console.error('Error al actualizar el jugador:', err);
          alert(`Error al actualizar el jugador: ${err.error?.message || 'Por favor, inténtelo de nuevo.'}`);
        }
      });
    } else {
      // Mostrar errores de validación si el formulario no es válido
      if (!this.editPlayerForm.valid) {
        Object.keys(this.editPlayerForm.controls).forEach(key => {
          const control = this.editPlayerForm.get(key);
          if (control?.invalid) {
            control.markAsTouched();
          }
        });
        alert('Por favor, complete todos los campos requeridos correctamente.');
      }
    }

  
  }
  borrarJugador(player: any):void{
    this.moduloHttpService.deletePlayer(player.id, this.token).subscribe({
        next: ()=> {
          alert('El jugador fue eliminado con exito')
         
        },
        
        error: (err) => {
          console.error('Error al eliminar el jugador:', err);
          alert('Error al eliminar el jugador. Por favor, inténtelo de nuevo.');
        }
    })
}

}
