import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModuloHTTPService } from '../../core/services/modulo-http.service';
import { Chart, ChartConfiguration, ChartData, ChartOptions } from 'chart.js/auto';

@Component({
  selector: 'app-stats-timeline',
  templateUrl: './stats-timeline.component.html',
  styleUrls: ['./stats-timeline.component.scss']
})
export class StatsTimelineComponent implements OnInit {
  playerId: number | null = null;
  playerName: string = '';
  playerFaceUrl: string = '';
  availableSkills: string[] = [];
  selectedSkill: string = '';
  chart: Chart | null = null;
  statsData: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private httpService: ModuloHTTPService
  ) {}

  ngOnInit() {
    // Obtener el ID del jugador de la ruta
    this.route.params.subscribe(params => {
      this.playerId = +params['id'];
      this.loadPlayerData();
      this.loadAvailableSkills();
    });
  }

  loadPlayerData() {
    if (this.playerId) {
      this.httpService.getPlayer(this.playerId).subscribe({
        next: (player: any) => {
          console.log('Player data received:', player);
          this.playerName = player.long_name;
          this.playerFaceUrl = player.player_face_url;
        },
        error: (error: Error) => {
          console.error('Error al cargar datos del jugador:', error);
        }
      });
    }
  }

  loadAvailableSkills() {
    if (this.playerId) {
      const skillsToShow = [
        'overall',
        'pace',
        'shooting',
        'passing',
        'dribbling',
        'defending',
        'physic',
        'attacking_crossing',
        'attacking_finishing',
        'attacking_heading_accuracy',
        'attacking_short_passing',
        'attacking_volleys',
        'skill_ball_control',
        'skill_dribbling',
        'skill_long_passing',
        'mentality_positioning',
        'mentality_vision',
        'power_shot_power',
        'power_stamina',
        'power_strength'
      ];
      this.availableSkills = skillsToShow;
      if (skillsToShow.length > 0) {
        this.selectedSkill = skillsToShow[0];
        this.loadStatsData();
      }
    }
  }

  loadStatsData() {
    if (this.playerId && this.selectedSkill) {
      this.httpService.getPlayer(this.playerId).subscribe({
        next: (player: any) => {
          // Crear un punto de datos con el valor de la habilidad seleccionada
          const statValue = player[this.selectedSkill];
          if (statValue !== undefined && statValue !== null) {
            this.statsData = [{
              year: player.fifa_version,
              value: statValue
            }];
            this.updateChart();
          } else {
            console.error('La habilidad seleccionada no existe en los datos del jugador');
          }
        },
        error: (error: Error) => {
          console.error('Error al cargar estadísticas:', error);
        }
      });
    }
  }

  onSkillChange() {
    this.loadStatsData();
  }

  formatSkillName(skill: string): string {
    // Reemplazar guiones bajos por espacios y capitalizar cada palabra
    const words = skill.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
    return words.join(' ');
  }

  updateChart(): void {
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (!ctx) return;

    const data: ChartData = {
      labels: this.statsData.map(stat => `FIFA ${stat.year}`),
      datasets: [{
        label: this.formatSkillName(this.selectedSkill),
        data: this.statsData.map(stat => stat.value),
        backgroundColor: '#4CAF50',
        borderColor: '#45a049',
        borderWidth: 1
      }]
    };

    const options: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 10
          }
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'top' as const
        },
        title: {
          display: true,
          text: `${this.formatSkillName(this.selectedSkill)} - ${this.playerName}`,
          font: {
            size: 16
          }
        }
      }
    };

    this.chart = new Chart(ctx, {
      type: 'bar',
      data,
      options
    });
  }
}
