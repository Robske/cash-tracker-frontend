import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalstorageService } from './shared/service/localstorage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'Next Tracker';

  constructor(public ls: LocalstorageService, public router: Router) {
    // redirect to login if not logged in
    if (!ls.isLoggedIn()) { router.navigate(['login']); }

    if (ls.isLoggedIn())
      ls.preLoadData();
  }

  public logout(): void {
    this.ls.removeUser();
    this.router.navigate(['login']);
  }
}
