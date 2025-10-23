  import { AfterViewInit, Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ModuloHTTPService } from '../../core/services/modulo-http.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';



@Component({
  selector: 'app-one-player',
  templateUrl: './one-player.component.html',
  styleUrl: './one-player.component.scss'
})
export class OnePlayerComponent implements OnChanges, OnInit, AfterViewInit {
  constructor(private moduloHttpService: ModuloHTTPService) {
    Chart.register(...registerables);
  }


  busquedaJugador:string = '';
  busquedaJugadorSeason:number = 23; // Inicializar con un valor válido por defecto
  resultados: any[] = [];
  busquedaRealizada = false;
  esquema: any;
  chart: Chart | undefined;
  dataPlayer:any[] = [];
  labelsPlayer: any[] =[];
  token: any = '';
  mensaje: string = '';
  
  ngOnInit(): void {
    this.token = localStorage.getItem('token');
    console.log('One-Player - Token obtenido:', this.token ? 'Token presente' : 'Sin token');
    
    if (!this.token) {
      this.mensaje = 'Por favor, inicie sesión para buscar jugadores';
    }
  }
  ngAfterViewInit(): void {
   
  }

  
  ngOnChanges(): void {
      this.obtenerJugador();
      
  }
  obtenerJugador(){
    console.log('🔍 One-Player - Iniciando búsqueda:', {
      busquedaJugador: this.busquedaJugador,
      busquedaJugadorSeason: this.busquedaJugadorSeason,
      token: this.token ? 'Token presente' : 'Sin token'
    });

    // Limpiar mensaje anterior
    this.mensaje = '';

    if (!this.busquedaJugador.trim()) {
      this.mensaje = 'Por favor ingrese el nombre de un jugador';
      console.log('❌ Error: Nombre de jugador vacío');
      return;
    }

    if (!this.token) {
      this.mensaje = 'Error: No hay token de autenticación disponible';
      console.log('❌ Error: Sin token');
      return;
    }

    if (this.busquedaJugador.length > 0 && this.busquedaJugadorSeason > 0) {
      console.log('📡 Realizando petición al servidor...');
     
      this.moduloHttpService
        .getOnePlayerByName(this.busquedaJugador, this.busquedaJugadorSeason, this.token)
        .subscribe({
          
          next: (players) => {
            console.log('✅ Respuesta del servidor:', players);
            this.resultados = Array.isArray(players) ? players : [players]; // Asegurar que sea un array
            this.busquedaRealizada = true;
            
            if (this.resultados.length > 0) {
              this.renderChart(this.resultados);
              this.mensaje = `Jugador encontrado: ${this.resultados[0].long_name}`;
            } else {
              this.mensaje = 'No se encontró el jugador especificado';
            }
          },
          error: (err) => {
            console.error('❌ Error en búsqueda:', err);
            this.resultados = [];
            this.busquedaRealizada = true;
            this.mensaje = `Error en la búsqueda: ${err.error?.error || err.message || 'Error desconocido'}`;
          },
        });
    } else {
      this.mensaje = 'Por favor complete todos los campos (nombre y temporada)';
      console.log('❌ Condiciones no cumplidas:', {
        nombreLength: this.busquedaJugador.length,
        season: this.busquedaJugadorSeason
      });
    }
  }
  renderChart(player: any): void {
    
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    
    if (this.chart) {
      this.chart.destroy();
    }
    
    for(player of player){
      console.log(player.player_positions)
      if(player.player_positions.toLowerCase() == 'gk'){
        
         this.dataPlayer = [player.goalkeeping_diving, player.goalkeeping_handling, player.goalkeeping_kicking, player.goalkeeping_positioning, player.goalkeeping_reflexes, player.goalkeeping_speed]
         this.labelsPlayer = ['Salto', 'Atrapar','Pegada','Posicionamiento', 'Reflejos','Velocidad']
      } else {
         this.dataPlayer = [player.pace, player.shooting, player.passing, player.dribbling, player.defending, player.physic]
         this.labelsPlayer = ['Velocidad', 'Tiro', 'Pase', 'Dribbling', 'Defensa', 'Físico']
      }
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data: {
        labels: this.labelsPlayer,
        datasets: [{
          label: 'Skills',
          data: this.dataPlayer,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 205, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(153, 102, 255, 0.2)'
          ],
          borderColor: [
            'rgb(255, 99, 132)',
            'rgb(255, 159, 64)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(54, 162, 235)',
            'rgb(153, 102, 255)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    };
    
    // Crea una nueva instancia de Chart
    this.chart = new Chart(ctx, config);
  }
  }
  
  
  }
