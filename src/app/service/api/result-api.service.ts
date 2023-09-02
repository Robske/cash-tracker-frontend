import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';
import { LocalstorageService } from '../general/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ResultApiService {

  constructor(private client: HttpClient, private _localstorage: LocalstorageService) { }

  public getTotals(period: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'result/' + period + '/all', { responseType: 'json' });
  }

  public getTotalsForUser(period: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'result/' + period + '/all/' + this._localstorage.getUserId(), { responseType: 'json' });
  }

  public getPlayedToday(): Observable<Object> {
    return this.client.get(environment.api_secondary + 'result/played/today', { responseType: 'json' });
  }

  public getYearByYearByUser(user: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'result/year-by-year/' + user, { responseType: 'json' });
  }

  public getMonthByMonthByUser(user: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'result/month-by-month/' + user, { responseType: 'json' });
  }

  public getCasinoByUser(user: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'result/casino/' + user, { responseType: 'json' });
  }
}
