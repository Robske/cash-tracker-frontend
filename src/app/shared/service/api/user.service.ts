import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private client: HttpClient) { }

  public getAll(): Observable<any> {
    return this.client.get(environment.api + 'user/all', { responseType: 'json' });
  }

  public loginByUsername(username: string, password: string): Observable<any> {
    return this.client.get(environment.api + 'user/login-by-username?username=' + username + '&password=' + password, { responseType: 'json' });
  }

  public loginByCode(code: string): Observable<any> {
    return this.client.get(environment.api + 'user/login-by-code?code=' + code, { responseType: 'json' });
  }

  public getConnectionsByUser(userId: string): Observable<any> {
    return this.client.get(environment.api + 'user/connections?requester=' + userId, { responseType: 'json' });
  }

  public toggleConnection(userId: string, connectionId: string): Observable<any> {
    return this.client.get(environment.api + 'user/toggle-connection?requester=' + userId + '&connection=' + connectionId, { responseType: 'json' });
  }
}
