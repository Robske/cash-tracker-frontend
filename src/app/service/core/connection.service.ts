import { Injectable } from '@angular/core';
import { ConnectionApiService } from '../api/connection-api.service';
import { KeyValue } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { LocalstorageService } from '../general/localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  constructor(private _connection: ConnectionApiService) { }

  public getConnectionsByUser(user: string): Observable<KeyValue<string, string>[]> {
    let result: Subject<KeyValue<string, string>[]> = new Subject<KeyValue<string, string>[]>();
    let output: KeyValue<string, string>[] = [];

    this._connection.getAllByUser(user).subscribe((response: object) => {
      const connections = JSON.parse(JSON.stringify(response));

      // loop over connections
      for (let index = 0; index < connections.length; index++)
        output.push({ key: connections[index][0], value: connections[index][1] });

      result.next(output);
    });

    return result;
  }

  public create(user: string, target: string) {
    return this._connection.create(user, target);
  }

  public delete(user: string, target: string) {
    return this._connection.delete(user, target);
  }
}
