import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class CasinoService {

  constructor(private client: HttpClient) { }

  public getAll(): Observable<any> {
    return this.client.get(environment.api + 'casino/all', { responseType: 'json' });
  }

  public getAllByUser(userId: string): Observable<any> {
    return this.client.get(environment.api + 'casino/all-by-user?requester=' + userId, { responseType: 'json' });
  }

  public toggleCasino(userId: string, casinoId: string): Observable<any> {
    return this.client.get(environment.api + 'casino/toggle-casino?requester=' + userId + '&casino=' + casinoId, { responseType: 'json' });
  }
}
