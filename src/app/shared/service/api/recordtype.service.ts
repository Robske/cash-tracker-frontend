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
}
