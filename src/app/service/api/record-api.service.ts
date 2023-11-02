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
    return this.client.get(environment.api_url + 'record/today/' + user, { responseType: 'json' });
  }

  public getLastXByUser(user: string, limit: number): Observable<Object> {
    return this.client.get(environment.api_url + 'record/lastX/' + user + '/' + limit, { responseType: 'json' });
  }

  public getAllByUser(user: string): Observable<Object> {
    return this.client.get(environment.api_url + 'record/all/' + user, { responseType: 'json' });
  }

  public getLastUpdateHash(user: string): Observable<Object> {
    return this.client.get(environment.api_url + 'record/last-update-hash?requester=' + user, { responseType: 'json' });
  }

  public create(record: Record): Observable<Object> {
    return this.client.post(environment.api_url + 'record/create', record);
  }

  public update(record: Record): Observable<Object> {
    return this.client.put(environment.api_url + 'record/update', record);
  }

  public delete(id: string) {
    return this.client.delete(environment.api_url + 'record/delete/' + id + '?requester=' + this._localstorage.getUserId());
  }
}
