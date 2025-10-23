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
   console.log('Token obtenido en ngOnInit:', this.token ? 'Token presente' : 'Sin token');
   
   if (!this.token) {
     this.mensaje = 'Por favor, inicie sesión para usar la búsqueda';
   }
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
    console.log('Iniciando búsqueda por nombre:', {
      busquedaNombre: this.busquedaNombre,
      limiteDeJugadores: this.limiteDeJugadores,
      token: this.token ? 'Token presente' : 'Sin token'
    });
   
    if (this.busquedaNombre.length > 0 && this.limiteDeJugadores !== null) {
      // Verificar que el token existe
      if (!this.token) {
        console.error('No hay token disponible');
        this.mensaje = 'Error: No se ha encontrado el token de autenticación';
        return;
      }
    
      this.moduloHttpService.getPlayerByName(this.busquedaNombre, this.token, this.limiteDeJugadores).subscribe({
        next: (players) => {
          console.log('Respuesta del servidor:', players);
          this.resultados = players;
          this.busquedaRealizada = true;
          this.valorDeDescarga = 'nombre';
          this.mensaje = players.length > 0 ? `Se encontraron ${players.length} jugadores` : 'No se encontraron jugadores';
        },
        error: (err) => {
          console.error('Error en búsqueda por nombre:', err);
          this.resultados = [];
          this.busquedaRealizada = true;
          this.mensaje = `Error en la búsqueda: ${err.error?.message || err.message || 'Error desconocido'}`;
        },
      });
    } else {
      console.log('Condiciones no cumplidas:', {
        nombreLength: this.busquedaNombre.length,
        limite: this.limiteDeJugadores
      });
      this.mensaje = 'Por favor ingrese un nombre para buscar';
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
    console.log('📥 Descargando CSV por nombre:', {
      nombre: this.busquedaNombre,
      token: this.token ? 'Presente' : 'Ausente'
    });

    if (this.busquedaNombre.length > 0) {
      this.mensaje = 'Descargando archivo...';
      this.moduloHttpService
        .downloadCSVName(this.busquedaNombre, this.token)
        .subscribe({
          next: (blob) => {
            console.log('✅ Blob recibido para descarga:', blob.size, 'bytes');
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jugadores_${this.busquedaNombre}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.mensaje = 'Archivo descargado exitosamente';
          },
          error: (error) => {
            console.error('❌ Error al descargar CSV por nombre:', error);
            this.mensaje = `Error al descargar: ${error.error?.message || error.message || 'Error desconocido'}`;
          }
        });
    } else {
      console.warn('⚠️ Nombre de búsqueda vacío');
      this.mensaje = 'Error: Debe ingresar un nombre para descargar';
    }
  }

  descargarCSVClub() {
    console.log('📥 Descargando CSV por club:', {
      club: this.busquedaClubName,
      temporada: this.busquedaClubSeason,
      token: this.token ? 'Presente' : 'Ausente'
    });

    if (this.busquedaClubName.length > 0) {
      this.mensaje = 'Descargando archivo...';
      this.moduloHttpService
        .downloadCSVClub(this.busquedaClubName, this.busquedaClubSeason, this.token)
        .subscribe({
          next: (blob) => {
            console.log('✅ Blob recibido para descarga:', blob.size, 'bytes');
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jugadores_${this.busquedaClubName}_${this.busquedaClubSeason}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.mensaje = 'Archivo descargado exitosamente';
          },
          error: (error) => {
            console.error('❌ Error al descargar CSV por club:', error);
            this.mensaje = `Error al descargar: ${error.error?.message || error.message || 'Error desconocido'}`;
          }
        });
    } else {
      console.warn('⚠️ Nombre de club vacío');
      this.mensaje = 'Error: Debe ingresar un club para descargar';
    }
  }

  descargarCSVPais() {
    console.log('📥 Descargando CSV por país:', {
      pais: this.busquedaPaisName,
      temporada: this.busquedaPaisSeason,
      token: this.token ? 'Presente' : 'Ausente'
    });

    if (this.busquedaPaisName.length > 0) {
      this.mensaje = 'Descargando archivo...';
      this.moduloHttpService
        .downloadCSVCountry(this.busquedaPaisName, this.busquedaPaisSeason, this.token)
        .subscribe({
          next: (blob) => {
            console.log('✅ Blob recibido para descarga:', blob.size, 'bytes');
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jugadores_${this.busquedaPaisName}_${this.busquedaPaisSeason}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.mensaje = 'Archivo descargado exitosamente';
          },
          error: (error) => {
            console.error('❌ Error al descargar CSV por país:', error);
            this.mensaje = `Error al descargar: ${error.error?.message || error.message || 'Error desconocido'}`;
          }
        });
    } else {
      console.warn('⚠️ Nombre de país vacío');
      this.mensaje = 'Error: Debe ingresar un país para descargar';
    }
  }

  descargaCSVPosicion(){
    console.log('📥 Descargando CSV por posición:', {
      posicion: this.busquedaPosicion,
      token: this.token ? 'Presente' : 'Ausente'
    });

    if (this.busquedaPosicion.length > 0) {
      this.mensaje = 'Descargando archivo...';
      this.moduloHttpService
        .downloadCSVPosition(this.busquedaPosicion, this.token)
        .subscribe({
          next: (blob) => {
            console.log('✅ Blob recibido para descarga:', blob.size, 'bytes');
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jugadores_${this.busquedaPosicion}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.mensaje = 'Archivo descargado exitosamente';
          },
          error: (error) => {
            console.error('❌ Error al descargar CSV por posición:', error);
            this.mensaje = `Error al descargar: ${error.error?.message || error.message || 'Error desconocido'}`;
          }
        });
    } else {
      console.warn('⚠️ Posición no seleccionada');
      this.mensaje = 'Error: Debe seleccionar una posición para descargar';
    }
  }

  descargaCSVValoracion(){
    console.log('📥 Descargando CSV por valoración:', {
      valoracion: this.busquedaValoracion,
      token: this.token ? 'Presente' : 'Ausente'
    });

    if (this.busquedaValoracion !== null && this.busquedaValoracion > 0) {
      this.mensaje = 'Descargando archivo...';
      this.moduloHttpService
        .downloadCSVOverall(this.busquedaValoracion, this.token)
        .subscribe({
          next: (blob) => {
            console.log('✅ Blob recibido para descarga:', blob.size, 'bytes');
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `jugadores_valoracion_${this.busquedaValoracion}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            this.mensaje = 'Archivo descargado exitosamente';
          },
          error: (error) => {
            console.error('❌ Error al descargar CSV por valoración:', error);
            this.mensaje = `Error al descargar: ${error.error?.message || error.message || 'Error desconocido'}`;
          }
        });
    } else {
      console.warn('⚠️ Valoración no especificada');
      this.mensaje = 'Error: Debe ingresar una valoración para descargar';
    }
  }
  

  //Esta función lo que hace es que dado el valor que pasamos en el html resultados llamara a la función correspondiente
  descarga(valor: string) {
    console.log('📥 Iniciando descarga CSV:', {
      tipo: valor,
      token: this.token ? 'Token presente' : 'Sin token',
      busquedaRealizada: this.busquedaRealizada,
      resultados: this.resultados.length
    });

    if (!this.token) {
      this.mensaje = 'Error: No hay token de autenticación para descargar';
      console.error('❌ Sin token para descarga');
      return;
    }

    if (!this.busquedaRealizada || this.resultados.length === 0) {
      this.mensaje = 'Error: Debe realizar una búsqueda antes de descargar';
      console.error('❌ Sin búsqueda realizada o sin resultados');
      return;
    }

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
      default:
        console.error('❌ Tipo de descarga no reconocido:', valor);
        this.mensaje = 'Error: Tipo de descarga no válido';
    }
  }
}