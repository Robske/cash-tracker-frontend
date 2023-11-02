import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment';

@Injectable({
  providedIn: 'root'
})
export class CasinoApiService {

  constructor(private client: HttpClient) { }

  public getAll() {
    return this.client.get(environment.api_url + 'casino/all', { responseType: 'json' });
  }
}
