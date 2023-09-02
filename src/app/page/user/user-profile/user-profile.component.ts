import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { faCaretRight, faCaretLeft, faCaretDown, faEye, faEyeSlash, faShuffle } from '@fortawesome/free-solid-svg-icons';
import { RecordService } from 'src/app/service/core/record.service';
import { Stats } from 'src/app/model/stats';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';
import { CasinoService } from 'src/app/service/core/casino.service';
import { RecordTypeService } from 'src/app/service/core/record-type.service';
import { FormControl } from '@angular/forms';
import { ProfileService } from 'src/app/service/general/profile.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public userId: string = '';
  public user: UserProfile | undefined;
  public userVisibleStats: Stats | undefined;
  public routeSubscription: Subscription | undefined;
  public noteInput = new FormControl();
  public amountOfRecordsInput = new FormControl();
  public amountOfRecords: number = 10;
  private monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  public math = Math;
  public allUsers: KeyValue<string, string>[] = [];
  public casinos: KeyValue<string, string>[] = [];
  public recordTypes: KeyValue<string, string>[] = [];


  public iconCarotRight = faCaretRight;
  public iconCarotLeft = faCaretLeft;
  public iconCarotDown = faCaretDown;
  public iconNote = faComment;
  public iconShow = faEye;
  public iconHide = faEyeSlash;
  public iconReverse = faShuffle;

  constructor(private route: ActivatedRoute, public _record: RecordService, public _localstorage: LocalstorageService,
    private _casino: CasinoService, private _recordType: RecordTypeService, public _profile: ProfileService) {
    _record.resetFilters();
    _profile.updateFilters();
    _casino.getAll().subscribe((casinos: KeyValue<string, string>[]) => this.casinos = casinos);
    _recordType.getAll().subscribe((recordTypes: KeyValue<string, string>[]) => this.recordTypes = recordTypes);

    this.amountOfRecordsInput.setValue(this.amountOfRecords);
    this.amountOfRecordsInput.valueChanges.subscribe(async (amount) => {
      if (Number.isFinite(amount) && amount > 0)
        this.amountOfRecords = this.math.floor(amount);
    });

    this.noteInput.valueChanges.subscribe(async (note) => {
      _record.filterNote = note;
      _profile.updateFilters();
    });
  }

  public ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(
      (params: any) => {
        this.userId = params['userid'];
      });
  }

  public hasValue(array: string[], value: string): boolean {
    return array.findIndex((x: string) => x === value) !== -1;
  }

  public getMonthName(month: string): string {
    return this.monthNames[Number(month) - 1];
  }
}

class UserProfile {
  id!: string;
  name!: string;
  stats!: Stats;
  visibleStats!: Stats;
}