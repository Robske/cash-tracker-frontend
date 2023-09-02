import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class RecordTypeApiService {

  constructor(private client: HttpClient) { }

  public getAll() {
    return this.client.get(environment.api_secondary + 'record-type/all', { responseType: 'json' });
  }
}
