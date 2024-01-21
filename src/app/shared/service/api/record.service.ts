import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';
import { Record } from '../../model/record';
import { LocalstorageService } from '../localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class RecordService {

  constructor(private client: HttpClient) { }

  public all(userId: string): Observable<any> {
    return this.client.get(environment.api + 'record/all?requester=' + userId, { responseType: 'json' });
  }

  public allFromToday(userId: string): Observable<any> {
    return this.client.get(environment.api + 'record/all/today?requester=' + userId, { responseType: 'json' });
  }

  public lastFromConnections(userId: string): Observable<any> {
    return this.client.get(environment.api + 'record/lastrecords?requester=' + userId, { responseType: 'json' });
  }

  public create(record: Record): Observable<any> {
    return this.client.post(environment.api + 'record/create', record);
  }

  public update(record: Record): Observable<Object> {
    return this.client.put(environment.api + 'record/update', record);
  }

  public delete(id: string, userId: string): Observable<Object> {
    return this.client.delete(environment.api + 'record/delete/' + id + '?requester=' + userId);
  }
}
