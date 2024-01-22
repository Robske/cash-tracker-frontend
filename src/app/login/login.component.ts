import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalstorageService } from '../shared/service/localstorage.service';
import { debounceTime, tap } from 'rxjs';
import { UserService } from '../shared/service/api/user.service';
import { User } from '../shared/model/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent {
  public usercodeInput = new FormControl();
  public form?: FormGroup<any>;
  public usernameInput = new FormControl();
  public passwordInput = new FormControl();
  public loginError = false;
  // public iconLock = faLock;

  constructor(private formBuilder: FormBuilder, private ls: LocalstorageService, private router: Router, private user: UserService) {
    this.form = this.formBuilder.group({
      username: this.formBuilder.nonNullable.control('', { validators: [Validators.required,] }),
      password: this.formBuilder.nonNullable.control('', { validators: [Validators.required,] }),
    });

    this.usercodeInput.valueChanges.pipe(
      tap(() => { this.loginError = false }),
      debounceTime(250),
    ).subscribe(async (code) => {
      if (code.length === 8) {
        user.loginByCode(code).subscribe(response => {
          if (!response.loginSuccess)
            return;

          this.ls.setUser(<User>response.user);
          this.ls.setToken(response.token);
          this.ls.setLoginMethod('password');
          this.ls.loadAppData();
          this.router.navigate(['']);
        });
      }
      else if (code.length > 8)
        this.usercodeInput.setValue(code.substring(0, 8));
    });
  }

  public onSubmit() {
    if (this.form?.valid) {
      const values = this.form.value;

      this.user.loginByUsername(values.username, values.password).subscribe(response => {
        if (!response.loginSuccess)
          return;

        this.ls.setUser(<User>response.user);
        this.ls.setToken(response.token);
        this.ls.setLoginMethod('password');
        this.ls.loadAppData();
        this.router.navigate(['']);
      });
    }
  }
}
