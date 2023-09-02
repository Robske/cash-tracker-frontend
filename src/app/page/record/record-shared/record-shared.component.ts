import { Component } from '@angular/core';
import { Record } from 'src/app/model/record';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';
import { ResultService } from 'src/app/service/general/result.service';
import { faCaretRight, faEyeSlash, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle as faCircleRegular } from '@fortawesome/free-regular-svg-icons';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { UserService } from 'src/app/service/core/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-record-shared',
  templateUrl: './record-shared.component.html',
  styleUrls: ['./record-shared.component.scss']
})
export class RecordSharedComponent {
  public results: [string, string, Record[]][] = [];
  public iconCarrot = faCaretRight;
  public iconNote = faComment;
  public iconHide = faEyeSlash;
  public iconOnlineStatus = faCircle;
  public iconOfflineStatus = faCircleRegular;
  public math = Math;

  constructor(public _result: ResultService, public _localstorage: LocalstorageService, public _user: UserService, public datePipe: DatePipe) { }

}
