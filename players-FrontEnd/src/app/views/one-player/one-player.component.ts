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
  busquedaJugadorSeason:number = 0;
  resultados: any[] = [];
  busquedaRealizada = false;
  esquema: any;
  chart: Chart | undefined;
  dataPlayer:any[] = [];
  labelsPlayer: any[] =[];
  token: any = '';
  
  ngOnInit(): void {
    this.token = localStorage.getItem('token');
  }
  ngAfterViewInit(): void {
   
  }

  
  ngOnChanges(): void {
      this.obtenerJugador();
      
  }
  obtenerJugador(){
    if (this.busquedaJugador.length > 0 && this.busquedaJugadorSeason !== null) {
     
      this.moduloHttpService
        .getOnePlayerByName(this.busquedaJugador, this.busquedaJugadorSeason, this.token)
        .subscribe({
          
          next: (players) => {
            this.resultados = players;
            this.busquedaRealizada = true;
            this.renderChart(this.resultados)
            console.log(this.resultados)
          },
          error: (err) => {
            this.resultados = [];
            console.log(err);
          },
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
