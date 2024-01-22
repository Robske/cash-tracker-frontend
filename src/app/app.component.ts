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

  public interval: any;
  constructor(public ls: LocalstorageService, public router: Router) {
    // redirect to login if not logged in
    if (!ls.isLoggedIn())
      router.navigate(['login']);
    else
      ls.loadAppData();

    // set interval
    this.interval = setInterval(() => {
      if (ls.isLoggedIn())
        ls.loadAppData();
    }, 30000);

  }

  public logout(): void {
    this.ls.removeUser();
    this.router.navigate(['login']);
  }
}
