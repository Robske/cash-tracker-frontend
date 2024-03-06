import { Injectable } from '@angular/core';
import { RecordType } from '../model/recordtype';
import { KeyValue } from '@angular/common';
import { Casino } from '../model/casino';
import { CasinoService } from './api/casino.service';
import { RecordtypeService } from './api/recordtype.service';
import { ResultService } from './api/result.service';
import { Observable, Subject } from 'rxjs';
import { User } from '../model/user';
import { Record } from '../model/record';
import { UserService } from './api/user.service';
import { RecordService } from './api/record.service';
import { SharedNettoResult } from '../model/SharedNettoResult';
import { ProfilePeriodResult } from '../model/ProfilePeriodResult';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageExtensionService {
  public weekdays = ['Zondag', 'Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag'];
  public monthNames = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sept', 'okt', 'nov', 'dec'];
  public monthNamesLong = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

  constructor(private casino: CasinoService, private record: RecordService, private recordType: RecordtypeService, private result: ResultService, private user: UserService) { }

  // #region results
  public loadDayResults(userId: string): Observable<KeyValue<string, number>[]> {
    const observable: Subject<KeyValue<string, number>[]> = new Subject<KeyValue<string, number>[]>();

    let dayResults: KeyValue<string, number>[] = [];
    this.result.lastDays(userId).subscribe((response: KeyValue<string, number>[]) => {
      let startDate = new Date();
      startDate.setDate(startDate.getDate() - 6);
      const endDate: Date = new Date();

      for (let i = startDate; i <= endDate; i.setDate(i.getDate() + 1)) {
        const dayHeader = this.weekdays[i.getDay()] + ', ' + i.getDate() + ' ' + (this.monthNames[i.getMonth()]);
        const dayResult = response.find(x => x.key === i.toISOString().split('T')[0])?.value ?? 0;

        dayResults.push({ key: dayHeader, value: dayResult });
      }

      observable.next(dayResults.reverse());
    });

    return observable;
  }

  public loadSharedNettoResults(userId: string): Observable<SharedNettoResult[]> {
    const observable: Subject<SharedNettoResult[]> = new Subject<SharedNettoResult[]>();
    this.result.sharedNettoResults(userId).subscribe((response: SharedNettoResult[]) => observable.next(response.reverse()));
    return observable;
  }

  public loadCasinoNettoResults(userId: string): Observable<KeyValue<string, KeyValue<string, number>[]>[]> {
    const observable: Subject<KeyValue<string, KeyValue<string, number>[]>[]> = new Subject<KeyValue<string, KeyValue<string, number>[]>[]>();
    this.result.casinoNettoResults(userId).subscribe((response: KeyValue<string, KeyValue<string, number>[]>[]) => observable.next(response.reverse()));
    return observable;
  }

  public loadTypeNettoResults(userId: string): Observable<KeyValue<string, KeyValue<string, number>[]>[]> {
    const observable: Subject<KeyValue<string, KeyValue<string, number>[]>[]> = new Subject<KeyValue<string, KeyValue<string, number>[]>[]>();
    this.result.typeNettoResults(userId).subscribe((response: KeyValue<string, KeyValue<string, number>[]>[]) => observable.next(response.reverse()));
    return observable;
  }

  public loadPeriodNettoResults(userId: string): Observable<ProfilePeriodResult[]> {
    const observable: Subject<ProfilePeriodResult[]> = new Subject<ProfilePeriodResult[]>();
    this.result.periodNettoResults(userId).subscribe((response: ProfilePeriodResult[]) => observable.next(response.reverse()));
    return observable;
  }
  // #endregion

  // #region casinos
  public loadCasinos(): Observable<Casino[]> {
    const observable: Subject<Casino[]> = new Subject<Casino[]>();
    this.casino.getAll().subscribe((response: Casino[]) => observable.next(response));
    return observable;
  }

  public loadCasinosByUser(userId: string): Observable<Casino[]> {
    const observable: Subject<Casino[]> = new Subject<Casino[]>();
    this.casino.getAllByUser(userId).subscribe((response: Casino[]) => observable.next(response));
    return observable;
  }

  public casinosToKeyValue(casinos: Casino[]): KeyValue<string, string>[] {
    let result: KeyValue<string, string>[] = [];

    for (let i = 0; i < casinos.length; i++) {
      result.push({ key: casinos[i].id, value: casinos[i].name });
    }

    result.sort((a, b) => (a.value > b.value ? 1 : -1));
    return result;
  }
  // #endregion

  // #region record
  public loadAllRecords(userId: string): Observable<KeyValue<string, Record[]>[]> {
    const observable: Subject<KeyValue<string, Record[]>[]> = new Subject<KeyValue<string, Record[]>[]>();
    this.record.all(userId).subscribe((response: KeyValue<string, Record[]>[]) => {

      for (let userRecords of response)
        for (let record of userRecords.value)
          if (record.notes != '')
            record.notes = record.notes.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

      observable.next(response)
    });
    return observable;
  }

  public loadRecordsToday(userId: string): Observable<Record[]> {
    const observable: Subject<Record[]> = new Subject<Record[]>();
    this.record.allFromToday(userId).subscribe((response: Record[]) => {
      for (let record of response)
        if (record.notes != '')
          record.notes = record.notes.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
      observable.next(response)
    });
    return observable;
  }

  public loadLastRecords(userId: string): Observable<Record[][]> {
    const observable: Subject<Record[][]> = new Subject<Record[][]>();
    this.record.lastFromConnections(userId).subscribe((response: Record[][]) => {
      response.sort((a, b) => (a[0].date > b[0].date ? 1 : -1)).sort((a, b) => (a[0].createdAt > b[0].createdAt ? 1 : -1)).reverse();
      for (let userRecords of response)
        for (let record of userRecords)
          if (record.notes != '')
            record.notes = record.notes.replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

      observable.next(response);
    });
    return observable;
  }
  // #endregion

  // #region recordTypes
  public loadRecordTypes(): Observable<RecordType[]> {
    const observable: Subject<RecordType[]> = new Subject<RecordType[]>();
    this.recordType.getAll().subscribe((response: RecordType[]) => observable.next(response));
    return observable;
  }

  public loadRecordTypesByUser(userId: string): Observable<RecordType[]> {
    const observable: Subject<RecordType[]> = new Subject<RecordType[]>();
    this.recordType.getAllByUser(userId).subscribe((response: RecordType[]) => observable.next(response));
    return observable;
  }

  public recordtypesToKeyValue(recordTypes: RecordType[]): KeyValue<string, string>[] {
    let result: KeyValue<string, string>[] = [];

    for (let i = 0; i < recordTypes.length; i++) {
      result.push({ key: recordTypes[i].id, value: recordTypes[i].name });
    }

    result.sort((a, b) => (a.value > b.value ? 1 : -1));
    return result;
  }
  // #endregion

  // #region users/connections
  public loadUsers(): Observable<User[]> {
    const observable: Subject<User[]> = new Subject<User[]>();
    this.user.getAll().subscribe((response: User[]) => observable.next(response));
    return observable;
  }

  public loadConnections(userId: string): Observable<User[]> {
    const observable: Subject<User[]> = new Subject<User[]>();
    this.user.getConnectionsByUser(userId).subscribe((response: User[]) => observable.next(response));
    return observable;
  }
  // #endregion
}
