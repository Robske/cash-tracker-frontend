import { Injectable } from '@angular/core';
import { ResultApiService } from '../api/result-api.service';
import { Observable, Subject } from 'rxjs';
import { Record } from 'src/app/model/record';
import { RecordApiService } from '../api/record-api.service';
import { UserApiService } from '../api/user-api.service';
import { Stats } from 'src/app/model/stats';
import { RecordService } from '../core/record.service';
import { LocalstorageService } from './localstorage.service';
import { PeriodDetails } from 'src/app/model/user-period-result';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ResultService {
  public availablePeriods: string[] = ['day', 'week', 'month', 'alltime'];
  public allUserResults: [string, string, Record[]][] = [];
  public playedToday: playedToday[] = [];
  public userStatsToday: Stats | undefined;
  public today: Date = new Date();
  private periodResults: PeriodResults[] = [];

  constructor(private _resultApi: ResultApiService, private _recordApi: RecordApiService, private _userApi: UserApiService,
    private _record: RecordService, private _localstorage: LocalstorageService) {
    for (let index = 0; index < this.availablePeriods.length; index++)
      this.periodResults.push({ period: this.availablePeriods[index], netResults: [] })
  }

  // get all stats via api
  public updateResultData(): void {
    this.today = new Date();
    for (let index = 0; index < this.availablePeriods.length; index++)
      this._resultApi.getTotalsForUser(this.availablePeriods[index]).subscribe(
        (response: object) =>
          this.periodResults[this.periodResults.findIndex((x: PeriodResults) => x.period === this.availablePeriods[index])].netResults = this.responseToPeriodResult(response));

    this.getLatestOfAll().subscribe((result: [string, string, Record[]][]) => this.allUserResults = result);
    this.getPlayedToday().subscribe((result: playedToday[]) => this.playedToday = result);
    this._record.getUserRecordsToday(this._localstorage.getUserId()).subscribe((stats: Stats) => this.userStatsToday = stats);
  }

  public getPeriodResultByUser(period: string, user: string) {
    const periodResult = this.periodResults.find((x: PeriodResults) => (x.period === period))?.netResults.find((y: [string, string, number]) => y[0] === user)?.[2] ?? 0;
    return periodResult;
  }

  // return period results
  public getPeriodStats(period: string): [string, string, number][] {
    const netResultsIndex = this.periodResults.findIndex((x: PeriodResults) => x.period === period);
    return netResultsIndex !== -1 ? this.periodResults[netResultsIndex].netResults : [];
  }

  // returns true when user has best net in period
  public isPeriodWinner(period: string, user: string): boolean {
    const netResultsIndex = this.periodResults.findIndex((x: PeriodResults) => x.period === period);
    if (netResultsIndex === -1) return false

    const netResults = this.periodResults[netResultsIndex].netResults;
    if (netResults.length > 0 && netResults[0][0] === user)
      return true;

    return false;
  }

  // returns true when user has worst net in period
  public isPeriodLoser(period: string, user: string): boolean {
    const netResultsIndex = this.periodResults.findIndex((x: PeriodResults) => x.period === period);
    if (netResultsIndex === -1) return false

    const netResults = this.periodResults[netResultsIndex].netResults;
    if (netResultsIndex !== -1 && netResults.length > 0 &&
      netResults[netResults.length - 1][0] === user && netResults[netResults.length - 1][2] < 0)
      return true;

    return false;
  }

  // translates api response to KeyValue array
  private responseToPeriodResult(response: object): [string, string, number][] {
    let output: [string, string, number][] = [];
    const x = JSON.parse(JSON.stringify(response));

    for (let index = 0; index < x.length; index++) {
      const element = x[index];

      output.push([element[0], element[1], element[2]])
    }

    return output;
  }

  public getLatestByUserId(user: string): [string, string, Record[]] {
    return this.allUserResults.find((x: [string, string, Record[]]) => x[0] === user) ?? ['', '', []];
  }

  // get last 5 records for all users
  public getLatestOfAll(): Observable<[string, string, Record[]][]> {
    const result: Subject<[string, string, Record[]][]> = new Subject<[string, string, Record[]][]>();
    let output: [string, string, Record[]][] = [];

    // get all users
    this._userApi.getAllByUser().subscribe((responseUser: object) => {
      const users = JSON.parse(JSON.stringify(responseUser));

      // loop over users
      for (let index = 0; index < users.length; index++) {
        const user = users[index];

        // get last x records from user
        this._recordApi.getLastXByUser(user[0], 5).subscribe((responseRecord: object) => {
          const records = JSON.parse(JSON.stringify(responseRecord));
          let compiledRecords: Record[] = [];

          // loop over records
          for (let index = 0; index < records.length; index++) {
            const record = records[index];
            if (record[4].length > 0)
              record[4] = record[4].replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

            // add Record
            compiledRecords.push({
              casino: record[5],
              type: record[6],
              deposit: record[2],
              withdrawal: record[3],
              total: record[3] - record[2],
              date: record[0],
              note: record[4],
              created_at: record[1],
            });
          }

          output.push([user[0], user[1], compiledRecords]);

          // this is the last user, so order list based on timings
          if (output.length === users.length)
            result.next(this.orderSharedResult(output));
        });
      }
    });

    return result;
  }

  public updateLastXByUser(user: string, amount: number) {
    const userIndex = this.allUserResults.findIndex((x: [string, string, Record[]]) => x[0] === user);

    if (userIndex == -1)
      return

    this._recordApi.getLastXByUser(user, amount).subscribe((responseRecord: object) => {
      const records = JSON.parse(JSON.stringify(responseRecord));
      let compiledRecords: Record[] = [];

      // loop over records
      for (let index = 0; index < records.length; index++) {
        const record = records[index];
        if (record[4].length > 0)
          record[4] = record[4].replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');

        // add Record
        compiledRecords.push({
          casino: record[5],
          type: record[6],
          deposit: record[2],
          withdrawal: record[3],
          total: record[3] - record[2],
          date: record[0],
          note: record[4],
          created_at: record[1],
        });
      }

      this.allUserResults[userIndex][2] = compiledRecords;
    });
  }

  // Order user results by record date and created time
  private orderSharedResult(allResults: [string, string, Record[]][]): [string, string, Record[]][] {
    let output: [string, string, Record[]][] = [];
    let timings: [string, Date, Date][] = [];

    // loop over users
    for (let index = 0; index < allResults.length; index++) {
      const userResult = allResults[index];

      let lastRecordedDate = new Date();
      let lastRecordedTime = new Date();
      lastRecordedDate.setDate(lastRecordedDate.getDate() - 999 * 999);
      lastRecordedTime.setDate(lastRecordedTime.getDate() - 999 * 999);

      // loop over records and determine last
      for (let index = 0; index < userResult[2].length; index++) {
        const record = userResult[2][index] as Record;
        const recordDate = new Date(record.date);
        const recordTime = new Date(record.created_at);
        if (recordDate >= lastRecordedDate) {
          lastRecordedDate = recordDate;

          if (recordTime >= lastRecordedTime)
            lastRecordedTime = recordTime
        }
      };

      timings.push([userResult[0], lastRecordedDate, lastRecordedTime])
    }

    timings = timings.sort((a, b) => (a[2] > b[2]) ? -1 : 1).sort((a, b) => (a[1] > b[1]) ? -1 : 1);

    // loop over sorted timings and add to output
    for (let index = 0; index < timings.length; index++)
      output.push(allResults.find((x: [string, string, Record[]]) => x[0] === timings[index][0])!);

    return output;
  }

  public getPlayedToday(): Observable<playedToday[]> {
    const result: Subject<playedToday[]> = new Subject<playedToday[]>();
    let output: playedToday[] = [];
    this._resultApi.getPlayedToday().subscribe((response: object) => {
      const rows = JSON.parse(JSON.stringify(response));
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        output.push({
          casino: element[0],
          type: element[1],
          count: element[2],
          net: element[3]
        });
      }
      result.next(output);
    });

    return result;
  }

  public getMonthByMonthByUser(user: string): Observable<PeriodDetails[]> {
    const result: Subject<PeriodDetails[]> = new Subject<PeriodDetails[]>();
    let output: PeriodDetails[] = [];
    this._resultApi.getMonthByMonthByUser(user).subscribe((response: Object) => {
      const rows = JSON.parse(JSON.stringify(response));
      // add results to output
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        output.push({
          period_indicator_abstract: element[0].toString().substring(2),
          period_indicator_detail: element[1],
          net: element[2]
        });
      }

      result.next(output);
    });

    return result;
  }

  public getYearByYearByUser(user: string): Observable<PeriodDetails[]> {
    const result: Subject<PeriodDetails[]> = new Subject<PeriodDetails[]>();
    let output: PeriodDetails[] = [];
    this._resultApi.getYearByYearByUser(user).subscribe((response: Object) => {
      const rows = JSON.parse(JSON.stringify(response));
      // add results to output
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        output.push({
          period_indicator_abstract: element[0],
          period_indicator_detail: '',
          net: element[1]
        });
      }

      result.next(output);
    });

    return result;
  }

  public getCasinoResultByUser(user: string): Observable<KeyValue<string, number>[]> {
    const result: Subject<KeyValue<string, number>[]> = new Subject<KeyValue<string, number>[]>();
    let output: KeyValue<string, number>[] = [];
    this._resultApi.getCasinoByUser(user).subscribe((response: Object) => {
      const rows = JSON.parse(JSON.stringify(response));
      // add results to output
      for (let index = 0; index < rows.length; index++) {
        const element = rows[index];
        output.push({ key: element[0], value: element[1] });
      }

      result.next(output);
    });

    return result;
  }
}

class PeriodResults {
  period: string = '';
  netResults: [string, string, number][] = [];
}

class playedToday {
  casino: string = '';
  type: string = '';
  count: number = 0;
  net: number = 0;
}