import { Component } from '@angular/core';
import { UserService } from 'src/app/service/core/user.service';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
})
export class UserSettingsComponent {
  constructor(public _user: UserService, public _localstorage: LocalstorageService) {

  }

  public updatePingDetailed(detail: string) {
    this._user.updatePing(detail).subscribe((x: any) => this._user.getPings());
  }
}
