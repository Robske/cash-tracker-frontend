import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, tap } from 'rxjs';
import { UserApiService } from 'src/app/service/api/user-api.service';
import { UserService } from 'src/app/service/core/user.service';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  public usercodeInput = new FormControl();
  public form?: FormGroup<any>;
  public usernameInput = new FormControl();
  public passwordInput = new FormControl();
  public loginError = false;
  public iconLock = faLock;

  constructor(private fb: FormBuilder, private _user: UserService, private _router: Router, private _localstorage: LocalstorageService) {
    this.form = this.fb.group({
      username: this.fb.nonNullable.control('', { validators: [Validators.required,] }),
      password: this.fb.nonNullable.control('', { validators: [Validators.required,] }),
    });

    this.usercodeInput.valueChanges.pipe(
      tap(() => { this.loginError = false }),
      debounceTime(250),
    ).subscribe(async (code) => {
      if (code.length === 8) {
        _user.loginByCode(code).subscribe((result: boolean) => {
          this.loginError = !result;
          if (result) {
            _localstorage.setUserLoginMethod('code');
            _router.navigate(['']);
          }
        });
      }
      else if (code.length > 8)
        this.usercodeInput.setValue(code.substring(0, 8));
    });
  }

  public onSubmit() {
    if (this.form?.valid) {
      const values = this.form.value;

      this._user.loginByUsernamePassword(values.username, values.password).subscribe((result: boolean) => {
        this.loginError = !result;
        if (result) {
          this._localstorage.setUserLoginMethod('password');
          this._router.navigate(['']);
        }
      });
    }
  }
}
