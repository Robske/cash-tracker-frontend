import { Injectable, Inject } from '@angular/core';
import { UserApiService } from '../api/user-api.service';
import { Observable, Subject } from 'rxjs';
import { LocalstorageService } from '../general/localstorage.service';
import { RecordApiService } from '../api/record-api.service';
import { Stats } from 'src/app/model/stats';
import { KeyValue } from '@angular/common';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public pings: Ping[] = [];
  private inverval: any;

  constructor(private _userApi: UserApiService, private _recordApi: RecordApiService, private _localstorage: LocalstorageService, @Inject(DOCUMENT) private document: Document) {
    if (_localstorage.ifUser()) {
      this.getNewToken();
      this.getPings();
    }

    this.inverval = setInterval(() => {
      if (document.hasFocus() && _localstorage.ifUser()) {
        this.getNewToken();
        this.getPings();
      }
    }, 5000);
  }

  private getNewToken() {
    if (this._localstorage.getUserToken() != '')
      this._userApi.refreshToken().subscribe((token: any) => this._localstorage.setUserToken(token));
  }

  public getUserRecordsToday(user: string): Observable<Stats> {
    const result: Subject<Stats> = new Subject<Stats>();
    let output = new Stats();

    this._recordApi.getTodayByUser(user).subscribe((response: object) => {
      const records = JSON.parse(JSON.stringify(response));

      // loop over records
      for (let index = 0; index < records.length; index++) {
        const element = records[index];

        // add record to list
        output.records.push({
          casino: element[5],
          type: element[6],
          deposit: element[2],
          withdrawal: element[3],
          total: element[3] - element[2],
          date: element[0],
          note: element[4],
          created_at: element[1],
        });

        // calculate total status
        output.deposit += element[2];
        output.withdrawal += element[3];
        output.total += element[3] - element[2];
      }

      // sort
      output.records = output.records.sort((a, b) => (a.created_at > b.created_at) ? -1 : 1).sort((a, b) => (a.date > b.date) ? -1 : 1);
      result.next(output);
    });

    return result;
  }

  public loginByCode(code: string): Observable<boolean> {
    let result: Subject<boolean> = new Subject<boolean>();

    this._userApi.getByCode(code).subscribe((response: object) => {
      const user = JSON.parse(JSON.stringify(response));

      if (user[0] != undefined) {
        this._localstorage.setUser(user);
        this._localstorage.setLastUpdateHash('');
        result.next(true);
      } else
        result.next(false);
    });

    return result;
  }

  public loginByUsernamePassword(username: string, password: string): Observable<boolean> {
    let result: Subject<boolean> = new Subject<boolean>();

    this._userApi.getByUsernamePassword(username, password).subscribe((response: object) => {
      const user = JSON.parse(JSON.stringify(response));

      if (user[0] != undefined) {
        this._localstorage.setUser(user);
        this._localstorage.setLastUpdateHash('');
        result.next(true);
      } else
        result.next(false);
    });

    return result;
  }

  public loggedIn(): boolean {
    return localStorage.getItem('user') ? true : false;
  }

  public getAll(): Observable<KeyValue<string, string>[]> {
    let result: Subject<KeyValue<string, string>[]> = new Subject<KeyValue<string, string>[]>();
    let output: KeyValue<string, string>[] = [];

    this._userApi.getAll().subscribe((responseUser: object) => {
      const users = JSON.parse(JSON.stringify(responseUser));

      // loop over users
      for (let index = 0; index < users.length; index++)
        output.push({ key: users[index][0], value: users[index][1] });

      result.next(output);
    });

    return result;
  }

  public getAllByUser(): Observable<KeyValue<string, string>[]> {
    let result: Subject<KeyValue<string, string>[]> = new Subject<KeyValue<string, string>[]>();
    let output: KeyValue<string, string>[] = [];

    this._userApi.getAllByUser().subscribe((responseUser: object) => {
      const users = JSON.parse(JSON.stringify(responseUser));

      // loop over users
      for (let index = 0; index < users.length; index++)
        output.push({ key: users[index][0], value: users[index][1] });

      result.next(output);
    });

    return result;
  }

  public updatePing(detail: string) {
    return this._userApi.updatePing(detail);
  }

  public updateUsernamePassword(username: string, password: string): Observable<object> {
    return this._userApi.updateUsernamePassword(username, password);
  }

  public getPings(): void {
    let result: Ping[] = [];
    this._userApi.getPingsByUser(this._localstorage.getUserId()).subscribe((response: object) => {
      const pings = JSON.parse(JSON.stringify(response));

      // loop over pings
      for (let index = 0; index < pings.length; index++)
        result.push({ user: pings[index][0], time_diff: pings[index][1], detailed: pings[index][2] });

      this.pings = result;
    });
  }

  public getPingByUser(user: string): number {
    return this.pings.find((x: Ping) => x.user === user)?.time_diff ?? -1;
  }

  public getPingDetailByUser(user: string): number {
    return this.pings.find((x: Ping) => x.user === user)?.detailed ?? 0;
  }
}

class Ping {
  user!: string;
  time_diff!: number;
  detailed!: number;
}
