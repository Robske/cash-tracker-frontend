import { Injectable } from '@angular/core';
import { UserService } from '../core/user.service';
import { RecordService } from '../core/record.service';
import { LocalstorageService } from './localstorage.service';
import { KeyValue } from '@angular/common';
import { Stats } from 'src/app/model/stats';
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ResultService } from './result.service';
import { PeriodDetails } from 'src/app/model/user-period-result';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  public usersData: UserProfile[] = [];
  public userVisibleStats: Stats | undefined;
  public routeSubscription: Subscription | undefined;
  public noteInput = new FormControl();
  public casinos: KeyValue<string, string>[] = [];
  public recordTypes: KeyValue<string, string>[] = [];

  constructor(private _user: UserService, public _record: RecordService,
    public _localstorage: LocalstorageService, private _result: ResultService) {

    _record.resetFilters();
    this.noteInput.valueChanges.subscribe(async (note) => _record.filterNote = note);
  }

  public getUserData(userId: string): UserProfile {
    return this.usersData.find((x: UserProfile) => x.id === userId) ?? new UserProfile;
  }

  public updateFilters() {
    for (let index = 0; index < this.usersData.length; index++) {
      const userData = this.usersData[index];
      userData.visibleStats = this._record.applyFilterToStats(userData.stats)
      userData.dayResults = this._record.getDayResult(userData.visibleStats.records);
    }
  }

  public updateProfileData(): void {
    this._user.getAllByUser().subscribe((users: KeyValue<string, string>[]) => {
      for (let userIndex = 0; userIndex < users.length; userIndex++) {
        const user = users[userIndex];

        let usersDataIndex = this.usersData.findIndex((userData: UserProfile) => userData.id === user.key);
        if (usersDataIndex === -1) {
          this.usersData.push({
            id: user.key,
            name: user.value,
            stats: new Stats,
            visibleStats: new Stats,
            dayResults: [],
            lowestDay: 0,
            highestDay: 0,
            monthResults: [],
            yearResults: [],
            casinoResults: [],
          });

          usersDataIndex = this.usersData.findIndex((userData: UserProfile) => userData.id === user.key);
        }

        let userData = this.usersData[usersDataIndex]
        this._record.getUserRecords(user.key).subscribe((stats: Stats) => {
          userData.stats = stats;
          userData.visibleStats = this._record.applyFilterToStats(stats);
          userData.dayResults = this._record.getDayResult(userData.visibleStats.records);
          userData.lowestDay = Math.min(...userData.dayResults.map((x: KeyValue<string, number>) => x.value));
          userData.highestDay = Math.max(...userData.dayResults.map((x: KeyValue<string, number>) => x.value));
        });

        this._result.getMonthByMonthByUser(user.key).subscribe((result: PeriodDetails[]) => userData.monthResults = result.slice(0, 12));
        this._result.getYearByYearByUser(user.key).subscribe((result: PeriodDetails[]) => userData.yearResults = result.slice(0, 12));
        this._result.getCasinoResultByUser(user.key).subscribe((result: KeyValue<string, number>[]) => userData.casinoResults = result);
      }
    });
  }
}

class UserProfile {
  id!: string;
  name!: string;
  stats!: Stats;
  visibleStats!: Stats;
  dayResults!: KeyValue<string, number>[];
  lowestDay!: number;
  highestDay!: number;
  monthResults!: PeriodDetails[];
  yearResults!: PeriodDetails[];
  casinoResults!: KeyValue<string, number>[];
}