import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModuloHTTPService {
  urlApi = 'http://localhost:3000/api/players/';

  constructor(private httpClient: HttpClient) {}

  getPlayer(id: number): Observable<any> {
    return this.httpClient.get(`${this.urlApi}/${id}`);
  }

  getPlayerByName(name: string, token: string, limit: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('limit', limit.toString());
    return this.httpClient.get(`${this.urlApi}name/${name}`, {
      headers,
      params,
    });
  }

  getPlayersByClub(
    club: string,
    season: number,
    token: string,
    limit: number
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('limit', limit.toString());
    return this.httpClient.get(`${this.urlApi}club/${club}/${season}`, {
      headers,
      params,
    });
  }

  getPlayersByCountry(
    country: string,
    season: number,
    token: string,
    limit: number
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('limit', limit.toString());
    return this.httpClient.get(`${this.urlApi}country/${country}/${season}`, {
      headers,
      params,
    });
  }

  getPlayersByPosition(
    position: string,
    token: string,
    limit: number
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('limit', limit.toString());
    return this.httpClient.get(`${this.urlApi}position/${position}`, {
      headers,
      params,
    });
  }

  getPlayersByOverall(
    overall: number,
    token: string,
    limit: number
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = new HttpParams().set('limit', limit.toString());
    return this.httpClient.get(`${this.urlApi}overall/${overall}`, {
      headers,
      params,
    });
  }

  downloadCSVName(name: string, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get(`${this.urlApi}name/${name}/csv`, {
      responseType: 'blob',
      headers,
    });
  }
  downloadCSVClub(
    club: string,
    season: number,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get(`${this.urlApi}club/${club}/${season}/csv`, {
      responseType: 'blob',
      headers,
    });
  }

  downloadCSVCountry(country: string, season: number, token: string):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get(
      `${this.urlApi}country/${country}/${season}/csv`,
      {
        responseType: 'blob',
        headers,
      }
    );
  }
  downloadCSVPosition(position: string, token: string):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get(`${this.urlApi}position/${position}/csv`, {
      responseType: 'blob',
      headers,
    });
  }

  downloadCSVOverall(overall: number, token: string):Observable<any>{
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get(`${this.urlApi}overall/${overall}/csv`, {
      responseType: 'blob',
      headers,
    });
  }

  getOnePlayerByName(
    name: string,
    season: number,
    token: string
  ): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.get(`${this.urlApi}name/${name}/${season}`, {
      headers,
    });
  }

  updatePlayer(id: number, playerData: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.put(`${this.urlApi}${id}`, playerData, { headers });
  }

  createPlayer(playerData: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.post(this.urlApi, playerData, { headers });
  }

  deletePlayer(playerId: any, token: string): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.httpClient.delete(`${this.urlApi}${playerId}`, { headers });
  }
}
