import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordtypeService {

  constructor(private client: HttpClient) { }

  public getAll(): Observable<any> {
    return this.client.get(environment.api + 'recordtype/all', { responseType: 'json' });
  }

  public getAllByUser(userId: string): Observable<any> {
    return this.client.get(environment.api + 'recordtype/all-by-user?requester=' + userId, { responseType: 'json' });
  }

  public toggleRecordType(userId: string, recordTypeId: string): Observable<any> {
    return this.client.get(environment.api + 'recordtype/toggle-recordtype?requester=' + userId + '&recordType=' + recordTypeId, { responseType: 'json' });
  }
}
