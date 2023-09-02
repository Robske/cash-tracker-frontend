import { Injectable } from '@angular/core';
import { RecordTypeApiService } from '../api/record-type-api.service';
import { Observable, Subject } from 'rxjs';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class RecordTypeService {

  constructor(private _recordType: RecordTypeApiService) { }

  public getAll(): Observable<KeyValue<string, string>[]> {
    const result: Subject<KeyValue<string, string>[]> = new Subject<KeyValue<string, string>[]>();
    let recordTypes: KeyValue<string, string>[] = [];

    this._recordType.getAll().subscribe(response => {
      const jsonResponse = JSON.parse(JSON.stringify(response));

      for (let index = 0; index < jsonResponse.length; index++)
        recordTypes.push({ key: jsonResponse[index][0], value: jsonResponse[index][1] });

      result.next(recordTypes.sort((a, b) => (a.value > b.value ? 1 : -1)));
    });

    return result;
  }
}
