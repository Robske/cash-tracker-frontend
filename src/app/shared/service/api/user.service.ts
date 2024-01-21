import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private client: HttpClient) { }

  public loginByUsername(username: string, password: string): Observable<any> {
    return this.client.get(environment.api + 'user/login-by-username?username=' + username + '&password=' + password, { responseType: 'json' });
  }

  public getConnectionsByUser(userId: string): Observable<any> {
    return this.client.get(environment.api + 'user/connections?requester=' + userId, { responseType: 'json' });
  }

  // public getByUsernamePassword(username: string, password: string): Observable<Object> {
  //   return this.client.get(environment.api_url + 'user/login-by-password?username=' + username + '&password=' + password, { responseType: 'json' });
  // }

  // public refreshToken(): Observable<Object> {
  //   return this.client.get(environment.api_url + 'user/refresh-token?requester=' + this._localstorage.getUserId() + '&token=' + this._localstorage.getUserToken(), { responseType: 'text' });
  // }

  // public getAll(): Observable<Object> {
  //   return this.client.get(environment.api_url + 'user/all', { responseType: 'json' });
  // }

  // public getAllByUser(): Observable<Object> {
  //   return this.client.get(environment.api_url + 'user/all/' + this._localstorage.getUserId(), { responseType: 'json' });
  // }

  // public getPingsByUser(user: string): Observable<Object> {
  //   return this.client.get(environment.api_url + 'user/pings/' + user, { responseType: 'json' });
  // }

  // public updatePing(detail: string): Observable<Object> {
  //   return this.client.get(environment.api_url + 'user/ping/update/' + this._localstorage.getUserId() + '/' + detail, { responseType: 'text' });
  // }

  // public updateUsernamePassword(username: string, password: string): Observable<Object> {
  //   return this.client.get(environment.api_url + 'user/updatelogin?requester=' + this._localstorage.getUserId() + '&username=' + username + '&password=' + password, { responseType: 'json' });
  // }
}
