import { Component } from '@angular/core';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';
import { ResultService } from 'src/app/service/general/result.service';
import { faCrown, faAnglesUp, faAnglesDown, faDice } from '@fortawesome/free-solid-svg-icons';
import { RecordService } from 'src/app/service/core/record.service';
import { FormControl } from '@angular/forms';
import { UserService } from 'src/app/service/core/user.service';
import { Router } from '@angular/router';

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

  public usernameInput = new FormControl();
  public passwordInput = new FormControl();

  constructor(public _router: Router, public _localstorage: LocalstorageService, public _result: ResultService, private _user: UserService) {
    this.user = _localstorage.getUsername();
  }

  public onSubmit() {
    let username = this.usernameInput.value;
    let password = this.passwordInput.value;

    if (username.length < 3 || password < 5)
      return;

    this._user.updateUsernamePassword(username, password).subscribe((result: any) => {
      if (result == 1) {
        this._localstorage.removeUser();
        this._router.navigate(['login']);
      }
    });
  }
}