import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, tap } from 'rxjs';
import { UserApiService } from 'src/app/service/api/user-api.service';
import { UserService } from 'src/app/service/core/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public userInput = new FormControl();
  public loginError = false;
  public iconLock = faLock;

  constructor(private _userApi: UserApiService, private _user: UserService, private _router: Router) {
    this.userInput.valueChanges.pipe(
      tap(() => { this.loginError = false }),
      debounceTime(250),
    ).subscribe(async (code) => {
      if (code.length === 8) {
        _user.loginByCode(code).subscribe((result: boolean) => {
          this.loginError = !result;
          if (result) _router.navigate([''])
        });
      }
      else if (code.length > 8)
        this.userInput.setValue(code.substring(0, 8));
    });
  }
}
