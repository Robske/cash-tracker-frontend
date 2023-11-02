import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';
import { LocalstorageService } from '../general/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  constructor(private client: HttpClient, private _localstorage: LocalstorageService) { }

  public getByCode(code: string): Observable<Object> {
    return this.client.get(environment.api_url + 'user/login-by-code?code=' + code, { responseType: 'json' });
  }

  public refreshToken(): Observable<Object> {
    return this.client.get(environment.api_url + 'user/refresh-token?requester=' + this._localstorage.getUserId() + '&token=' + this._localstorage.getUserToken(), { responseType: 'text' });
  }

  public getAll(): Observable<Object> {
    return this.client.get(environment.api_url + 'user/all', { responseType: 'json' });
  }

  public getAllByUser(): Observable<Object> {
    return this.client.get(environment.api_url + 'user/all/' + this._localstorage.getUserId(), { responseType: 'json' });
  }

  public getPingsByUser(user: string): Observable<Object> {
    return this.client.get(environment.api_url + 'user/pings/' + user, { responseType: 'json' });
  }

  public createPing(): Observable<Object> {
    return this.client.get(environment.api_url + 'user/ping/' + this._localstorage.getUserId(), { responseType: 'text' });
  }

  public updatePing(detail: string): Observable<Object> {
    return this.client.get(environment.api_url + 'user/ping/update/' + this._localstorage.getUserId() + '/' + detail, { responseType: 'text' });
  }
}
