import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(private client: HttpClient) { }

  public lastDays(userId: string): Observable<any> {
    return this.client.get(environment.api + 'result/last-days?requester=' + userId, { responseType: 'json' });
  }

  public sharedNettoResults(userId: string): Observable<any> {
    return this.client.get(environment.api + 'result/shared-stats?requester=' + userId, { responseType: 'json' });
  }

  public casinoNettoResults(userId: string): Observable<any> {
    return this.client.get(environment.api + 'result/casino-stats?requester=' + userId, { responseType: 'json' });
  }

  public typeNettoResults(userId: string): Observable<any> {
    return this.client.get(environment.api + 'result/type-stats?requester=' + userId, { responseType: 'json' });
  }

  public periodNettoResults(userId: string): Observable<any> {
    return this.client.get(environment.api + 'result/period-stats?requester=' + userId, { responseType: 'json' });
  }
}
