import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModuloHTTPService } from '../../core/services/modulo-http.service';
import { AuthService } from '../../core/services/auth.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'app-compare-player',
  templateUrl: './compare-player.component.html',
  styleUrls: ['./compare-player.component.scss'] 
})
export class ComparePlayerComponent implements OnInit {
encodeURIComponent(arg0: any) {
throw new Error('Method not implemented.');
}
  busquedaNombre: string = '';
  token: any = '';
  limiteDeJugadores: number = 15;
  resultados: any[] = [];
  chart: Chart | undefined;
  arquero: boolean = false;
  campo: boolean = false;
  dataPlayer:any[] = [];
  labelsPlayer: any[] =[];
  selectedStat: string = '';
//  url = '';
 // player_face_url = '';

  constructor(
    private moduloHttpService: ModuloHTTPService, 
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {
    Chart.register(...registerables);
  }

  getImageUrl(player: any): string {
    if (!player || !player.player_face_url) {
      return '/assets/default-player.png';
    }
    
    // Verificar si la URL es de sofifa y usar proxy si es necesario
    if (player.player_face_url.includes('cdn.sofifa.net')) {
      // Extraer el ID del jugador y la versión de FIFA de la URL
      const match = player.player_face_url.match(/players\/(\d+)\/(\d+)\/(\d+)_120\.png/);
      if (match) {
        const [, playerId, version] = match;
        // Construir una URL alternativa que funcione
        return `https://fifastatic.fifaindex.com/FIFA${version}/players/${playerId}.png`;
      }
    }
    
    return player.player_face_url;
  }

  sanitizeUrl(url: string): SafeUrl {
    if (!url) return '';
    try {
      const safeUrl = this.sanitizer.bypassSecurityTrustUrl(this.getImageUrl({ player_face_url: url }));
      return safeUrl;
    } catch (error) {
      console.error('Error al procesar la URL:', error);
      return this.sanitizer.bypassSecurityTrustUrl('/assets/default-player.png');
    }
  }

  handleImageError(event: any): void {
    const img = event.target;
    if (!img.dataset.hasRetried) {
      img.dataset.hasRetried = 'true';
      // Intentar con una fuente alternativa primero
      if (img.src.includes('fifastatic.fifaindex.com')) {
        // Si la fuente alternativa falla, usar la imagen por defecto
        img.src = '/assets/default-player.png';
      } else if (img.src.includes('cdn.sofifa.net')) {
        // Si la URL original de sofifa falla, intentar con fifaindex
        const match = img.src.match(/players\/(\d+)\/(\d+)\/(\d+)_120\.png/);
        if (match) {
          const [, playerId, version] = match;
          img.src = `https://fifastatic.fifaindex.com/FIFA${version}/players/${playerId}.png`;
        } else {
          img.src = '/assets/default-player.png';
        }
      } else {
        img.src = '/assets/default-player.png';
      }
    }
    img.onerror = null; // Prevenir futuros errores
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  
    
  }


  valorJugador(posicion: string) {
    if (posicion === 'arquero') {
      this.arquero = true;
      this.campo = false;
      console.log(this.arquero, this.campo)
    } else if (posicion === 'campo') {
      this.arquero = false;
      this.campo = true;
      console.log(this.arquero, this.campo)
    }
  }
  
  obtenerJugadorPorNombre() {
    if (this.busquedaNombre.length > 0) {
      this.moduloHttpService.getPlayerByName(this.busquedaNombre, this.token, this.limiteDeJugadores).subscribe({
        next: (players) => {
          this.resultados = players;     

          this.renderChart();
        },
        error: (err) => {
          this.resultados = [];
          console.log(err);
        },
      });
    }
  }

/*obtenerJugadorPorNombre() {
  if (this.busquedaNombre.length > 0) {
    this.moduloHttpService.getPlayerByName(this.busquedaNombre, this.token, this.limiteDeJugadores).subscribe({
      next: (players) => {
        // Codificamos las URLs de imagen para evitar errores de renderizado
        this.resultados = players.map((player: ComparePlayerComponent) => {
          const url = player.player_face_url;
          return {
            ...player,
            player_face_url: url && typeof url === 'string' ? encodeURI(url) : ''
          };
        });

        this.renderChart();
      },
      error: (err) => {
        this.resultados = [];
        console.log(err);
      },
    });
  }
}
  */



  renderChart(): void {
    console.log(this.selectedStat)
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;

    if (this.chart) {
      this.chart.destroy(); 
    }

   
    if (ctx && this.resultados.length > 0) {
      const labels =   this.resultados.map(player => player.fifa_version); 
      const data = {
        labels: labels,
        datasets: [{
          label: this.resultados[0].long_name, 
          data: this.resultados.map(player => player[this.selectedStat]), 
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      };

      const config: ChartConfiguration<'line'> = {
        type: 'line',
        data: data,
        options: {
          scales: {
            y: {
              beginAtZero: true 
            }
          }
        }
      };

      this.chart = new Chart(ctx, config);
    } else {
      console.error('No se encontró el canvas o no hay resultados.');
    }
  }
}
