import { Component, OnChanges, OnInit } from '@angular/core';
import { ModuloHTTPService } from '../../core/services/modulo-http.service';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-filtros',
  templateUrl: './filtros.component.html',
  styleUrl: './filtros.component.scss',
})
export class FiltrosComponent implements OnChanges, OnInit{
  constructor(private moduloHttpService: ModuloHTTPService, private authService: AuthService) {}

  idNumber: number | null = null;
  limiteDeJugadores: number = 5;
  busquedaNombre: string = '';
  busquedaClubName: string = '';
  busquedaClubSeason: number = 0;
  busquedaPaisName: string = '';
  busquedaPaisSeason: number = 0;
  busquedaPosicion: string = '';
  busquedaValoracion: number = 0;
  player: any = null;
  resultados: any[] = [];
  busquedaRealizada = false;
  valorDeDescarga: string = '';
  mensaje: string = '';

  nombre = false;
  posicion = false;
  pais = false;
  club = false;
  valoracion = false;

  token: any = ''
  activar(valor: string) {
    this.nombre = false;
    this.posicion = false;
    this.pais = false;
    this.club = false;
    this.valoracion = false;

    switch (valor) {
      case 'nombre':
        this.nombre = true;
        this.busquedaRealizada = false;
        break;
      case 'posicion':
        this.posicion = true;
        this.busquedaRealizada = false;
        break;
      case 'pais':
        this.pais = true;
        this.busquedaRealizada = false;
        break;
      case 'club':
        this.club = true;
        this.busquedaRealizada = false;
        break;
      case 'valoracion':
        this.valoracion = true;
        this.busquedaRealizada = false;
        break;
    }
  }
ngOnInit(): void {
   this.token = localStorage.getItem('token');
   
 };


  ngOnChanges(): void {
   

 
  }
  obtenerJugador() {
    if (this.idNumber !== null) {
      this.moduloHttpService.getPlayer(this.idNumber).subscribe({
        next: (player) => {
          console.log(player);
          this.player = player;
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  obtenerJugadorPorNombre() {
   
    if (this.busquedaNombre.length > 0 && this.limiteDeJugadores !== null) {
    
      this.moduloHttpService.getPlayerByName(this.busquedaNombre, this.token, this.limiteDeJugadores).subscribe({
        next: (players) => {
          this.resultados = players;
          this.busquedaRealizada = true;
          this.valorDeDescarga = 'nombre';
        },
        error: (err) => {
          this.resultados = [];
          this.busquedaRealizada = true;
          console.log(err);
        },
      });
    }
  }

  obtenerJugadoresPorClub() {
    if (this.busquedaClubName.length > 0) {
      this.moduloHttpService
        .getPlayersByClub(this.busquedaClubName, this.busquedaClubSeason, this.token, this.limiteDeJugadores)
        .subscribe({
          next: (players) => {
            this.resultados = players;
            this.busquedaRealizada = true;
            this.valorDeDescarga = 'club';
          },
          error: (err) => {
            this.resultados = [];
            console.log(err);
          },
        });
    }
  }

  obtenerJugadoresPorPais() {
    if (this.busquedaPaisName.length > 0) {
      this.moduloHttpService
        .getPlayersByCountry(this.busquedaPaisName, this.busquedaPaisSeason, this.token, this.limiteDeJugadores)
        .subscribe({
          next: (players) => {
            this.resultados = players;
            this.busquedaRealizada = true;
            this.valorDeDescarga = 'pais';
          },
          error: (err) => {
            this.resultados = [];
            console.log(err);
          },
        });
    }
  }

  obtenerJugadoresPorPosicion() {
    if (this.busquedaPosicion.length > 0) {
      this.moduloHttpService
        .getPlayersByPosition(this.busquedaPosicion, this.token, this.limiteDeJugadores)
        .subscribe({
          next: (players) => {
            if (players.length > 0) {
              this.resultados = players;
              this.busquedaRealizada = true;
              this.valorDeDescarga = 'posicion';
            }
          },
          error: (err) => {
            this.resultados = [];
            console.log(err);
          },
        });
    }
  }

  obtenerJugadoresPorValoracion() {
    if (this.busquedaValoracion !== null) {
      this.moduloHttpService
        .getPlayersByOverall(this.busquedaValoracion, this.token, this.limiteDeJugadores)
        .subscribe({
          next: (players) => {
            this.resultados = players;
            this.busquedaRealizada = true;
            this.valorDeDescarga = 'valoracion';
          },
          error: (err) => {
            this.resultados = [];
            console.log(err);
          },
        });
    }
  }

  descargarCSVNombre() {
    if (this.busquedaNombre.length > 0) {
      this.moduloHttpService
        .downloadCSVName(this.busquedaNombre, this.token)
        .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'jugadores.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    }
  }

  descargarCSVClub() {
    if (this.busquedaClubName.length > 0) {
      this.moduloHttpService
        .downloadCSVClub(this.busquedaClubName, this.busquedaClubSeason, this.token)
        .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'jugadores.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    }
  }

  descargarCSVPais() {
    if (this.busquedaPaisName.length > 0) {
      //podria usar la misma variable para season, cambiar
      this.moduloHttpService
        .downloadCSVCountry(this.busquedaPaisName, this.busquedaPaisSeason, this.token)
        .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'jugadores.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    }
  }

  descargaCSVPosicion(){
    if (this.busquedaPosicion.length > 0) {
      
      this.moduloHttpService
        .downloadCSVPosition(this.busquedaPosicion, this.token)
        .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'jugadores.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    }
  }

  descargaCSVValoracion(){
    if (this.busquedaValoracion !== null) {
      
      this.moduloHttpService
        .downloadCSVOverall(this.busquedaValoracion, this.token)
        .subscribe((blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'jugadores.csv';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        });
    }
  }
  

  //Esta función lo que hace es que dado el valor que pasamos en el html resultados llamara a la función correspondiente
  descarga(valor: string) {
    switch (valor) {
      case 'nombre':
        this.descargarCSVNombre();
        break;
      case 'club':
        this.descargarCSVClub();
        break;
      case 'pais':
        this.descargarCSVPais();
        break;
      case 'posicion':
        this.descargaCSVPosicion();
        break;

      case 'valoracion':
        this.descargaCSVValoracion();
        break;
    }
  }
}