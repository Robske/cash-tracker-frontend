import { Injectable } from '@angular/core';
import { CasinoApiService } from '../api/casino-api.service';
import { Observable, Subject } from 'rxjs';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CasinoService {

  constructor(private _casino: CasinoApiService) { }

  public getAll(): Observable<KeyValue<string, string>[]> {
    const result: Subject<KeyValue<string, string>[]> = new Subject<KeyValue<string, string>[]>();
    let casinos: KeyValue<string, string>[] = [];

    this._casino.getAll().subscribe(response => {
      const jsonResponse = JSON.parse(JSON.stringify(response));

      for (let index = 0; index < jsonResponse.length; index++)
        casinos.push({ key: jsonResponse[index][0], value: jsonResponse[index][1] });

      result.next(casinos.sort((a, b) => (a.value > b.value ? 1 : -1)));
    });

    return result;
  }
}
