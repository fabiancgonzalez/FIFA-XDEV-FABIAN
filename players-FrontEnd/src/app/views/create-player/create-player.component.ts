import { Component, OnInit } from '@angular/core';

import { ModuloHTTPService } from '../../core/services/modulo-http.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-player',
  templateUrl: './create-player.component.html',
  styleUrl: './create-player.component.scss'
})
export class CreatePlayerComponent implements OnInit{
  createPlayerForm: FormGroup;
 token:any = ''
  constructor(private moduloHttpService: ModuloHTTPService, private fb: FormBuilder) {
    //creacion del formulario
    this.createPlayerForm = this.fb.group({
      long_name: ['', Validators.required],
      nationality_name: ['', Validators.required],
      overall: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      age: ['', [Validators.required, Validators.min(16), Validators.max(50)]],
      club_name: ['',Validators.required], 
      player_positions: ['', Validators.required], 
      preferred_foot: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }
  crearJugador(): void {
    
    if (this.createPlayerForm.valid) {
     
      this.moduloHttpService.createPlayer(this.createPlayerForm.value, this.token).subscribe({
        next: () => {
          alert('Jugador creado con éxito');
          this.createPlayerForm.reset();
        },
        error: (err) => {
          console.error('Error al crear el jugador:', err);
          alert('Error al crear el jugador. Por favor, inténtelo de nuevo.');
        }
      });
    }
  }
}
