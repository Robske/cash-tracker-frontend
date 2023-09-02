import { Injectable } from '@angular/core';
import { UserService } from '../core/user.service';
import { RecordService } from '../core/record.service';
import { LocalstorageService } from './localstorage.service';
import { CasinoService } from '../core/casino.service';
import { RecordTypeService } from '../core/record-type.service';
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
  public statsLoaded: boolean = false;

  constructor(private _user: UserService, public _record: RecordService,
    public _localstorage: LocalstorageService, private _casino: CasinoService,
    private _recordType: RecordTypeService, private _result: ResultService) {
    _casino.getAll().subscribe((casinos: KeyValue<string, string>[]) => this.casinos = casinos);
    _recordType.getAll().subscribe((recordTypes: KeyValue<string, string>[]) => this.recordTypes = recordTypes);

    _record.resetFilters();
    this.noteInput.valueChanges.subscribe(async (note) => _record.filterNote = note);
  }

  public getUserData(userId: string): UserProfile {
    return this.usersData.find((x: UserProfile) => x.id === userId) ?? new UserProfile;
  }

  public updateFilters() {
    for (let index = 0; index < this.usersData.length; index++) {
      const data = this.usersData[index];
      data.visibleStats = this._record.applyFilterToStats(data.stats)
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
            monthResults: [],
            yearResults: [],
            casinoResults: [],
          });

          usersDataIndex = this.usersData.findIndex((userData: UserProfile) => userData.id === user.key);
        }

        this._record.getUserRecords(user.key).subscribe((stats: Stats) => {
          this.usersData[usersDataIndex].stats = stats;
          this.usersData[usersDataIndex].visibleStats = this._record.applyFilterToStats(stats);
        });

        this._result.getMonthByMonthByUser(user.key).subscribe((result: PeriodDetails[]) => this.usersData[usersDataIndex].monthResults = result.slice(0, 12));
        this._result.getYearByYearByUser(user.key).subscribe((result: PeriodDetails[]) => this.usersData[usersDataIndex].yearResults = result.slice(0, 12));
        this._result.getCasinoResultByUser(user.key).subscribe((result: KeyValue<string, number>[]) => this.usersData[usersDataIndex].casinoResults = result);
      }

      this.statsLoaded = true;
    });
  }
}

class UserProfile {
  id!: string;
  name!: string;
  stats!: Stats;
  visibleStats!: Stats;
  monthResults!: PeriodDetails[];
  yearResults!: PeriodDetails[];
  casinoResults!: KeyValue<string, number>[];
}