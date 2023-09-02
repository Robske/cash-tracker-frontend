import { Injectable } from '@angular/core';
import { User } from 'src/app/model/user';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {
  // sharedResultPeriod
  public getSharedResultPeriod(): string {
    return localStorage.getItem('sharedResultPeriod') ?? '';
  }

  public setSharedResultPeriod(period: string): void {
    localStorage.setItem('sharedResultPeriod', period);
  }

  // darkmode
  public isDarkmode(): boolean {
    return localStorage.getItem('darkmode') === 'on';
  }

  public setDarkmode(status: string): void {
    localStorage.setItem('darkmode', status);
  }

  // show/hide profile period results
  public visibilityProfilePeriodResults(): boolean {
    return localStorage.getItem('showProfilePeriodResults') === "show";
  }

  public setVisibilityProfilePeriodResults(showOrHide: string): void {
    localStorage.setItem('showProfilePeriodResults', showOrHide);
  }

  // lastUpdateHash
  public getLastUpdateHash(): string {
    return localStorage.getItem('lastUpdateHash') ?? '';
  }

  public setLastUpdateHash(hash: string): void {
    localStorage.setItem('lastUpdateHash', hash);
  }

  // User variables
  public setUser(user: any): void {
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('userId', user[0]);
    localStorage.setItem('userName', user[1]);
    localStorage.setItem('userCode', user[2]);
    localStorage.setItem('userIsAdmin', user[3].toString());
    localStorage.setItem('userToken', user[4]);
  }

  public removeUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCode');
    localStorage.removeItem('userIsAdmin');
    localStorage.removeItem('userToken');
  }

  public ifUser(): boolean {
    return localStorage.getItem('user') ? true : false;
  }

  public getUser(): string {
    return localStorage.getItem('user') ?? '{}';
  }

  public getUsername(): string {
    return localStorage.getItem('userName') ?? '';
  }

  public getUserCode(): string {
    return localStorage.getItem('userCode') ?? '';
  }

  public getUserId(): string {
    return localStorage.getItem('userId') ?? '';
  }

  public getUserToken(): string {
    return localStorage.getItem('userToken') ?? '';
  }

  public setUserToken(token: string): void {
    localStorage.setItem('userToken', token);
  }
}
