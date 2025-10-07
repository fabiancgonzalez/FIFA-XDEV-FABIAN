import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModuloHTTPService } from '../../core/services/modulo-http.service';
import { AuthService } from '../../core/services/auth.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

@Component({
  selector: 'app-compare-player',
  templateUrl: './compare-player.component.html',
  styleUrls: ['./compare-player.component.scss'] 
})
export class ComparePlayerComponent implements OnInit {
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

  constructor(private moduloHttpService: ModuloHTTPService, private authService: AuthService) {
    Chart.register(...registerables);
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
