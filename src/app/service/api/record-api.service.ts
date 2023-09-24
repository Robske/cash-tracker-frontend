import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';
import { Record } from 'src/app/model/record';
import { LocalstorageService } from '../general/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class RecordApiService {

  constructor(private client: HttpClient, private _localstorage: LocalstorageService) { }

  public getTodayByUser(user: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'record/today/' + user, { responseType: 'json' });
  }

  public getLastXByUser(user: string, limit: number): Observable<Object> {
    return this.client.get(environment.api_secondary + 'record/lastX/' + user + '/' + limit, { responseType: 'json' });
  }

  public getAllByUser(user: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'record/all/' + user, { responseType: 'json' });
  }

  public getLastUpdateHash(user: string): Observable<Object> {
    return this.client.get(environment.api_secondary + 'record/last-update-hash?requester=' + user, { responseType: 'json' });
  }

  public create(record: Record): Observable<Object> {
    return this.client.post(environment.api_secondary + 'record/create', record);
  }

  public update(record: Record): Observable<Object> {
    return this.client.put(environment.api_secondary + 'record/update', record);
  }

  public delete(id: string) {
    return this.client.delete(environment.api_secondary + 'record/delete/' + id + '?requester=' + this._localstorage.getUserId());
  }

  // public restore(id: string) {
  //   return this.client.post(environment.api_primary + 'records/' + id + '/restore', null);
  // }
}
