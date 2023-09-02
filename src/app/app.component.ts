import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { faPowerOff, faPlus, faPencil, faAddressCard, faChartLine, faPeopleGroup, faHouse, faGear, faCodeCommit } from '@fortawesome/free-solid-svg-icons';
import { faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';
import { LocalstorageService } from './service/general/localstorage.service';
import { UserService } from './service/core/user.service';
import { ResultService } from './service/general/result.service';
import { ProfileService } from './service/general/profile.service';
import { RecordService } from './service/core/record.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'Cash tracker';
  public iconPowerOff = faPowerOff;
  public iconOff = faToggleOff;
  public iconOnn = faToggleOn;
  public iconPlus = faPlus;
  public iconEdit = faPencil;
  public iconProfile = faAddressCard;
  public iconChart = faChartLine;
  public iconGroup = faPeopleGroup;
  public iconHome = faHouse;
  public iconSettings = faGear;
  public iconPatchNotes = faCodeCommit;

  public latestHash: string = "";
  private inverval: any;
  private invervalAlways: any;

  constructor(public _router: Router, public _localstorage: LocalstorageService, public _user: UserService,
    private _result: ResultService, private _profile: ProfileService, private _record: RecordService) {
    // initial load
    if (!_localstorage.ifUser())
      _router.navigate(['login']);
    else
      this.updateData();

    // set interval
    this.inverval = setInterval(() => {
      if (_localstorage.ifUser()) {
        // call latest hash
        _record.getLastUpdateHash(_localstorage.getUserId()).subscribe((hash: string) => {
          // on new hash: update data
          if (hash != this.latestHash) {
            this.latestHash = hash;
            this.updateData();
          }
        });
      }
    }, 2500);
  }

  private updateData() {
    this._result.updateResultData();
    this._profile.updateProfileData();
  }

  ngOnDestroy() {
    if (this.inverval)
      clearInterval(this.inverval);

    if (this.invervalAlways)
      clearInterval(this.invervalAlways);
  }
}
