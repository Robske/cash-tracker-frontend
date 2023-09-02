import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ConnectionApiService {

  constructor(private client: HttpClient) { }

  public getAllByUser(user: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'connection/all/' + user, { responseType: 'json' });
  }

  public create(user: string, target: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'connection/create/' + user + '/' + target, { responseType: 'text' });
  }

  public delete(user: string, target: string) {
    return this.client.get(environment.api_secondary + 'connection/delete/' + user + '/' + target, { responseType: 'text' });
  }
}
