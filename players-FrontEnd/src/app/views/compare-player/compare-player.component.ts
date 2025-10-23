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

  //private readonly DEFAULT_PLAYER_IMAGE = 'https://cdn.sofifa.net/player_0.png';
  private readonly DEFAULT_PLAYER_IMAGE_LOCAL = 'assets/default-player.png';

  getImageUrl(player: any): string {
    // Usar directamente la URL de la base de datos
    if (player && player.player_face_url) {
      // Si es una URL de sofifa (que puede tener problemas de CORS), usar proxy por defecto
      if (player.player_face_url.includes('cdn.sofifa.net')) {
        console.log('🔄 Usando proxy para sofifa:', player.player_face_url);
        return `https://images.weserv.nl/?url=${encodeURIComponent(player.player_face_url)}`;
      }
      
      // Para otras URLs, usar directamente
      return player.player_face_url;
    }
    
    // Si no hay URL, usar imagen por defecto
    return this.DEFAULT_PLAYER_IMAGE_LOCAL;
  }

  handleImageError(event: any): void {
    const img = event.target;
    
    // Prevenir loop infinito
    if (img.src === this.DEFAULT_PLAYER_IMAGE_LOCAL) {
      img.onerror = null;
      return;
    }
    
    console.log('⚠️ Error cargando imagen:', img.src);
    
    // Intentar URLs alternativas si no se ha intentado antes
    if (!img.dataset.fallbackAttempted) {
      img.dataset.fallbackAttempted = 'true';
      
      // Si es sofifa, intentar con un proxy o servicio de imágenes
      if (img.src.includes('cdn.sofifa.net')) {
        // Intentar con un servicio proxy para evitar CORS
        const proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(img.src)}`;
        console.log('🔄 Intentando con proxy:', proxyUrl);
        img.src = proxyUrl;
        return;
      }
    }
    
    // Si todo falla, usar imagen por defecto
    console.log('🚫 Usando imagen por defecto');
    img.src = this.DEFAULT_PLAYER_IMAGE_LOCAL;
    img.onerror = null;
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
    if (!this.busquedaNombre || this.busquedaNombre.trim().length === 0) {
      return;
    }

    // Limpiar espacios extra y normalizar nombre
    const nombreBusqueda = this.busquedaNombre.trim();
    
    this.moduloHttpService.getPlayerByName(nombreBusqueda, this.token, this.limiteDeJugadores).subscribe({
      next: (players) => {
        if (Array.isArray(players)) {
          this.resultados = players;
          if (this.resultados.length > 0) {
            this.renderChart();
          }
        } else {
          console.error('Respuesta inesperada:', players);
          this.resultados = [];
        }
      },
      error: (err) => {
        this.resultados = [];
        if (err.status === 404) {
          console.log('No se encontraron jugadores con ese nombre');
        } else {
          console.error('Error al buscar jugadores:', err);
        }
      },
    });
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



  mostrarJugadorEnChart(nombreJugador: string): void {
    console.log('🎯 Mostrando jugador en gráfico:', nombreJugador);
    console.log('📊 Estadística seleccionada:', this.selectedStat);
    
    // Verificar primero si hay estadística seleccionada
    if (!this.selectedStat) {
      alert('Por favor selecciona una estadística antes de hacer clic en el jugador');
      return;
    }
    
    // Filtrar jugadores por nombre
    const jugadoresFiltrados = this.resultados.filter(player => 
      player.long_name === nombreJugador
    );

    console.log('🔍 Jugadores filtrados encontrados:', jugadoresFiltrados.length);
    
    if (jugadoresFiltrados.length > 0) {
      // Debug: verificar valores de la estadística
      jugadoresFiltrados.forEach((player, index) => {
        console.log(`👤 Jugador ${index + 1}:`, {
          nombre: player.long_name,
          version: player.fifa_version,
          estadistica: this.selectedStat,
          valor: player[this.selectedStat]
        });
      });
      
      // Mantener todos los jugadores pero destacar el clickeado
      this.renderChartDestacandoJugador(nombreJugador);
    } else {
      console.error('❌ No se encontró el jugador:', nombreJugador);
    }
  }

  renderChartDestacandoJugador(nombreDestacado: string): void {
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas no encontrado');
      return;
    }

    if (this.chart) {
      this.chart.destroy();
    }

    // Usar TODOS los jugadores como el botón buscar
    const jugadoresParaGrafico = this.resultados;
    const labels = jugadoresParaGrafico.map(player => player.fifa_version);
    const valores = jugadoresParaGrafico.map(player => player[this.selectedStat]);

    // Crear datasets: uno para todos los jugadores y otro para destacar el seleccionado
    const jugadoresDestacados = jugadoresParaGrafico.filter(p => p.long_name === nombreDestacado);
    const labelsDestacados = jugadoresDestacados.map(p => p.fifa_version);
    const valoresDestacados = jugadoresDestacados.map(p => p[this.selectedStat]);

    const datasets = [
      // Dataset para todos los jugadores (más tenue)
      {
        label: `Todos los jugadores - ${this.getStatDisplayName(this.selectedStat)}`,
        data: valores,
        fill: false,
        borderColor: 'rgba(75, 192, 192, 0.3)', // Más transparente
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 3,
        pointHoverRadius: 5,
        pointBackgroundColor: 'rgba(75, 192, 192, 0.3)'
      },
      // Dataset para el jugador destacado (muy visible)
      {
        label: `${nombreDestacado} - ${this.getStatDisplayName(this.selectedStat)}`,
        data: valoresDestacados,
        fill: false,
        borderColor: 'rgb(255, 99, 132)', // Rojo brillante
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.1,
        borderWidth: 4,
        pointRadius: 12,
        pointHoverRadius: 15,
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
        pointBorderWidth: 3
      }
    ];

    // Crear gráfico con ambos datasets
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: datasets
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: `${nombreDestacado} destacado - ${this.getStatDisplayName(this.selectedStat)}`,
            font: {
              size: 16,
              weight: 'bold'
            }
          },
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: this.getStatDisplayName(this.selectedStat)
            }
          },
          x: {
            title: {
              display: true,
              text: 'Versión FIFA'
            }
          }
        }
      }
    });

    console.log(`✅ Gráfico creado destacando a: ${nombreDestacado}`);
  }

  private renderChartWithRetry(jugadoresFiltrados: any[], nombreJugador: string, attempt: number): void {
    const maxAttempts = 10;
    
    requestAnimationFrame(() => {
      const ctx = document.getElementById('myChart') as HTMLCanvasElement;
      
      if (ctx && ctx.getContext('2d')) {
        console.log('✅ Canvas encontrado en intento:', attempt + 1);
        this.renderChart(jugadoresFiltrados, nombreJugador);
      } else if (attempt < maxAttempts) {
        console.log('⏳ Canvas no disponible, reintentando...', attempt + 1);
        setTimeout(() => {
          this.renderChartWithRetry(jugadoresFiltrados, nombreJugador, attempt + 1);
        }, 50);
      } else {
        console.error('❌ No se pudo encontrar el canvas después de', maxAttempts, 'intentos');
        alert('Error: No se puede mostrar el gráfico. Recarga la página e intenta de nuevo.');
      }
    });
  }

  mostrarTodosLosJugadores(): void {
    console.log('📊 Mostrando todos los jugadores en el gráfico');
    if (this.selectedStat && this.resultados.length > 0) {
      this.renderChart();
    } else if (!this.selectedStat) {
      alert('Por favor selecciona una estadística');
    }
  }

  renderChart(jugadoresEspecificos?: any[], nombreEspecifico?: string): void {
    console.log('📊 Renderizando gráfico con estadística:', this.selectedStat);
    console.log('🎯 Jugadores específicos recibidos:', jugadoresEspecificos?.length || 0);
    console.log('👤 Nombre específico:', nombreEspecifico);
    
    const ctx = document.getElementById('myChart') as HTMLCanvasElement;
    console.log('🔍 Canvas element:', ctx);
    
    if (!ctx) {
      console.error('❌ No se encontró el elemento canvas con id "myChart"');
      return;
    }

    if (this.chart) {
      console.log('🗑️ Destruyendo gráfico anterior');
      this.chart.destroy(); 
    }

    // Usar jugadores específicos si se proporcionan, sino todos los resultados
      const jugadoresParaGrafico = jugadoresEspecificos || this.resultados;
      const nombreJugador = nombreEspecifico || (this.resultados.length > 0 ? this.resultados[0].long_name : '');
     
      console.log('📋 Jugadores para gráfico:', jugadoresParaGrafico.length);
      console.log('📊 Canvas encontrado:', !!ctx);
      console.log('✅ Estadística válida:', !!this.selectedStat);

    if (ctx && jugadoresParaGrafico.length > 0 && this.selectedStat) {
      const labels = jugadoresParaGrafico.map(player => player.fifa_version); 
      const valores = jugadoresParaGrafico.map(player => player[this.selectedStat]);
      
      console.log('🏷️ Labels (versiones FIFA):', labels);
      console.log('📈 Valores de estadística:', valores);
      console.log('🎮 Estadística buscada:', this.selectedStat);
      
      // Verificar si los valores son válidos
      const valoresValidos = valores.filter(val => val != null && val !== undefined && val !== '');
      console.log('✅ Valores válidos encontrados:', valoresValidos.length, 'de', valores.length);
      
      if (valoresValidos.length === 0) {
        console.error('❌ No hay valores válidos para graficar');
        alert(`No se encontraron valores válidos para la estadística: ${this.getStatDisplayName(this.selectedStat)}`);
        return;
      }
      
      // Hacer los puntos MÁS VISIBLES cuando hay pocos datos
      const esJugadorIndividual = jugadoresParaGrafico.length <= 3;
      const puntoSize = esJugadorIndividual ? 15 : 6; // Puntos MUCHO más grandes
      const lineaGrosor = esJugadorIndividual ? 4 : 2; // Línea más gruesa
      
      const data = {
        labels: labels,
        datasets: [{
          label: `${nombreJugador} - ${this.getStatDisplayName(this.selectedStat)}`, 
          data: valores, 
          fill: false,
          borderColor: jugadoresEspecificos ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)', 
          backgroundColor: jugadoresEspecificos ? 'rgba(255, 99, 132, 0.8)' : 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          borderWidth: lineaGrosor,
          pointRadius: puntoSize,
          pointHoverRadius: puntoSize + 3,
          pointBackgroundColor: jugadoresEspecificos ? 'rgb(255, 99, 132)' : 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      };

      const config: ChartConfiguration<'line'> = {
        type: 'line',
        data: data,
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: jugadoresEspecificos ? 
                `${nombreJugador} - ${this.getStatDisplayName(this.selectedStat)}` : 
                `Todos los jugadores - ${this.getStatDisplayName(this.selectedStat)}`
            },
            legend: {
              display: true,
              position: 'top'
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: this.getStatDisplayName(this.selectedStat)
              }
            },
            x: {
              title: {
                display: true,
                text: 'Versión FIFA'
              }
            }
          }
        }
      };

      this.chart = new Chart(ctx, config);
      console.log('🎉 Gráfico creado exitosamente con', valores.length, 'puntos de datos');
    } else {
      console.error('❌ No se pudo crear el gráfico:');
      console.error('- Canvas:', !!ctx);
      console.error('- Jugadores para gráfico:', jugadoresParaGrafico.length);
      console.error('- Estadística seleccionada:', this.selectedStat);
    }
  }

  private getStatDisplayName(stat: string): string {
    const statNames: { [key: string]: string } = {
      // Estadísticas de campo
      'pace': 'Velocidad',
      'shooting': 'Tiro',
      'passing': 'Pase', 
      'dribbling': 'Regate',
      'defending': 'Defensa',
      'physic': 'Físico',
      // Estadísticas de arquero
      'goalkeeping_diving': 'Salto',
      'goalkeeping_handling': 'Atrapar',
      'goalkeeping_kicking': 'Pegada',
      'goalkeeping_positioning': 'Posicionamiento',
      'goalkeeping_reflexes': 'Reflejos',
      'goalkeeping_speed': 'Velocidad'
    };
    return statNames[stat] || stat;
  }


}
