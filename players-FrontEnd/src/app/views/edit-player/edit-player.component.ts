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
      long_name: ['', Validators.required],
     
      nationality_name: ['', Validators.required],
      overall: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(50)]],
      club_name: [''],
      player_positions: [''],
     
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
      this.moduloHttpService.updatePlayer(this.selectedPlayerId, this.editPlayerForm.value, this.token).subscribe({
        next: () => {
          alert('Jugador actualizado con éxito');
          this.resultados = []; // Limpiar resultados después de actualizar
          this.busquedaJugador = ''; // Limpiar campo de búsqueda
          this.editPlayerForm.reset(); // Reiniciar el formulario
          this.selectedPlayerId = null; // Reiniciar ID seleccionado
        },
        error: (err) => {
          console.error('Error al actualizar el jugador:', err);
          alert('Error al actualizar el jugador. Por favor, inténtelo de nuevo.');
        }
      });
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
