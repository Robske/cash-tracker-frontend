import { Injectable } from '@angular/core';
import { RecordApiService } from '../api/record-api.service';
import { Record } from 'src/app/model/record';
import { Observable, Subject } from 'rxjs';
import { Stats } from 'src/app/model/stats';
import { faL } from '@fortawesome/free-solid-svg-icons';
import { KeyValue } from '@angular/common';
import { subscriptionLogsToBeFn } from 'rxjs/internal/testing/TestScheduler';

@Injectable({
  providedIn: 'root'
})
export class RecordService {
  public filterCasino: string[];
  public inverseFilterCasino: boolean = false;
  public filterRecordType: string[];
  public inverseFilterRecordType: boolean = false;
  public filterNote: string;

  constructor(private _record: RecordApiService) {
    this.filterCasino = [];
    this.filterRecordType = [];
    this.filterNote = '';
  }

  public resetFilters() {
    this.filterCasino = [];
    this.filterRecordType = [];
    this.filterNote = '';
  }

  public toggleCasinoInverse() {
    this.inverseFilterCasino = !this.inverseFilterCasino;
  }

  public toggleTypeInverse() {
    this.inverseFilterRecordType = !this.inverseFilterRecordType;
  }

  private recordToApiRecord(record: Record): {} {
    return {
      id: record.record_id,
      casino_id: record.casino_id,
      user_id: record.user_id,
      record_type_id: record.record_type_id,
      deposit: record.deposit,
      withdrawal: record.withdrawal,
      record_date: record.date,
      notes: record.note
    }
  }

  public create(record: Record): Observable<boolean> {
    const result: Subject<boolean> = new Subject<boolean>();
    this._record.create(record).subscribe((response: object) => result.next(true));
    return result;
  }

  public update(record: Record) {
    return this._record.update(record);
  }

  public delete(id: string) {
    return this._record.delete(id);
  }

  public getLastUpdateHash(user: string): Observable<string> {
    const result: Subject<string> = new Subject<string>();
    this._record.getLastUpdateHash(user).subscribe((response: object) => result.next(String(response)));
    return result;
  }

  public getUserRecords(user: string, beautifyUrl: boolean = true): Observable<Stats> {
    const result: Subject<Stats> = new Subject<Stats>();
    this._record.getAllByUser(user).subscribe((response: object) => result.next(this.responseToStats(response, beautifyUrl)));
    return result;
  }

  public getUserRecordsToday(user: string, beautifyUrl: boolean = true): Observable<Stats> {
    const result: Subject<Stats> = new Subject<Stats>();
    this._record.getTodayByUser(user).subscribe((response: object) => result.next(this.responseToStats(response, beautifyUrl)));
    return result;
  }

  private responseToStats(response: Object, beautifyUrl: boolean): Stats {
    const records = JSON.parse(JSON.stringify(response));
    let output = new Stats();

    // loop over records
    for (let index = 0; index < records.length; index++) {
      const element = records[index];
      if (beautifyUrl && element[4].length > 0)
        element[4] = element[4].replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

      // add record to list
      output.records.push({
        record_id: element[7],
        casino_id: element[8],
        record_type_id: element[9],
        casino: element[5],
        type: element[6],
        deposit: element[2],
        withdrawal: element[3],
        total: element[3] - element[2],
        date: element[0],
        note: element[4],
        created_at: element[1],
      });

      // update total status
      output.deposit += element[2];
      output.withdrawal += element[3];
      output.total += element[3] - element[2];
    }

    output.total_records = output.records.length;
    // return sorted list
    output.records = output.records.sort((a, b) => (a.created_at > b.created_at) ? -1 : 1).sort((a, b) => (a.date > b.date) ? -1 : 1);
    return output;
  }

  // apply casino filter
  public addOrRemoveFilterCasino(casino: string) {
    const index = this.filterCasino.findIndex((c: string) => c === casino);
    if (index === -1) this.filterCasino.push(casino);
    else this.filterCasino.splice(index, 1);
  }

  // apply record type file
  public addOrRemoveFilterRecordType(recordType: string) {
    const index = this.filterRecordType.findIndex((type: string) => type === recordType);
    if (index === -1) this.filterRecordType.push(recordType);
    else this.filterRecordType.splice(index, 1);
  }

  // Filter stats 
  public applyFilterToStats(input: Stats): Stats {
    let output = new Stats();

    for (let index = 0; index < input.records.length; index++) {
      const record = input.records[index];
      let casinoCheck = false;
      let recordTypeCheck = false;
      let noteCheck = false;

      // apply casino filter
      if (this.filterCasino.length === 0 ||
        (!this.inverseFilterCasino && this.filterCasino.findIndex((casino: string) => casino === record.casino) !== -1) ||
        (this.inverseFilterCasino && this.filterCasino.findIndex((casino: string) => casino === record.casino) === -1)
      )
        casinoCheck = true;

      // apply type filter
      if (this.filterRecordType.length === 0 ||
        (!this.inverseFilterRecordType && this.filterRecordType.findIndex((recordType: string) => recordType === record.type) !== -1) ||
        (this.inverseFilterRecordType && this.filterRecordType.findIndex((recordType: string) => recordType === record.type) === -1)
      )
        recordTypeCheck = true;

      // apply note filter
      if (this.filterNote.length === 0 ||
        (typeof record.note === 'string' && record.note.toLowerCase().includes(this.filterNote.toLowerCase())))
        noteCheck = true;


      // filters are all valid
      if (casinoCheck && recordTypeCheck && noteCheck) {
        output.records.push(record);

        // update total status
        output.deposit += record.deposit;
        output.withdrawal += record.withdrawal;
        output.total += record.withdrawal - record.deposit;
      }
    }

    output.total_records = output.records.length;
    return output;
  }

  public getDayResult(records: Record[]) {
    if (records.length === 0) return [];
    records.reverse();
    let output: KeyValue<string, number>[] = [];
    let day: string = records[0].date;
    let dayNet: number = 0;

    let total: number = 0;
    for (let index = 0; index < records.length; index++) {
      const record = records[index];
      if (record.date !== day) {
        output.push({ key: day, value: Number(dayNet.toFixed(2)) });
        day = record.date;
      }

      dayNet = dayNet + (record.withdrawal - record.deposit);
    }

    output.push({ key: day, value: Number(dayNet.toFixed(2)) });
    return output;
  }
}
