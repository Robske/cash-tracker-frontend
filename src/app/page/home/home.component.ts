import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { Stats } from 'src/app/model/stats';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';
import { ResultService } from 'src/app/service/general/result.service';
import { UserService } from 'src/app/service/core/user.service';
import { faCrown, faAnglesUp, faAnglesDown, faDice } from '@fortawesome/free-solid-svg-icons';
import { RecordService } from 'src/app/service/core/record.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public user: string = '';
  public iconCrown = faCrown;
  public iconUp = faAnglesUp;
  public iconDown = faAnglesDown;
  public iconDice = faDice;

  constructor(private _localstorage: LocalstorageService, private _record: RecordService, public _result: ResultService) {
    this.user = _localstorage.getUsername();
  }


}