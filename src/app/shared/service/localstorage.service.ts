import { Injectable } from '@angular/core';
import { User } from '../model/user';
import { KeyValue } from '@angular/common';
import { Casino } from '../model/casino';
import { Record } from '../model/record';
import { RecordType } from '../model/recordtype';
import { LocalstorageExtensionService } from './localstorage-extension.service';
import { SharedNettoResult } from '../model/SharedNettoResult';
import { ProfilePeriodResult } from '../model/ProfilePeriodResult';

@Injectable({
  providedIn: 'root'
})
export class LocalstorageService {

  constructor(private localstorageExtension: LocalstorageExtensionService) { }

  public loadAppData(): void {
    console.log('loading data');
    this.localstorageExtension.loadCasinos().subscribe((response: Casino[]) => this._casinos = response);
    this.localstorageExtension.loadCasinosByUser(this.getUserId()).subscribe((response: Casino[]) => this._userIgnoreCasinos = response);
    this.localstorageExtension.loadRecordTypes().subscribe((response: RecordType[]) => this._types = response);
    this.localstorageExtension.loadRecordTypesByUser(this.getUserId()).subscribe((response: RecordType[]) => this._userIgnoreTypes = response);
    this.localstorageExtension.loadConnections(this.getUserId()).subscribe((response: User[]) => this._userConnections = response);
    this.localstorageExtension.loadAllRecords(this.getUserId()).subscribe((response: KeyValue<string, Record[]>[]) => this._allRecords = response);
    this.localstorageExtension.loadRecordsToday(this.getUserId()).subscribe((response: Record[]) => this._recordsToday = response);
    this.localstorageExtension.loadLastRecords(this.getUserId()).subscribe((response: Record[][]) => this._lastRecords = response);
    this.localstorageExtension.loadDayResults(this.getUserId()).subscribe((response: KeyValue<string, number>[]) => this._userDayResults = response);
    this.localstorageExtension.loadSharedNettoResults(this.getUserId()).subscribe((response: SharedNettoResult[]) => this._SharedNettoResults = response);
    this.localstorageExtension.loadCasinoNettoResults(this.getUserId()).subscribe((response: KeyValue<string, KeyValue<string, number>[]>[]) => this._casinoNettoResults = response);
    this.localstorageExtension.loadPeriodNettoResults(this.getUserId()).subscribe((response: ProfilePeriodResult[]) => this._periodNettoResults = response);
    this.localstorageExtension.loadTypeNettoResults(this.getUserId()).subscribe((response: KeyValue<string, KeyValue<string, number>[]>[]) => this._typeNettoResults = response);
    this.localstorageExtension.loadUsers().subscribe((response: User[]) => this._users = response);
  }

  // #region user
  public isLoggedIn(): boolean {
    return localStorage.getItem('userId') ? true : false;
  }

  public setUser(user: User): void {
    localStorage.setItem('userId', user.id);
    localStorage.setItem('username', user.name);
  }

  public setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  public setLoginMethod(method: string): void {
    localStorage.setItem('userLoginMethod', method);
  }

  public getUserId(): string {
    return localStorage.getItem('userId') ?? '';
  }

  public getUserName(): string {
    return localStorage.getItem('userName') ?? '';
  }

  public getLoginMethod(): string {
    return localStorage.getItem('userLoginMethod') ?? '';
  }

  public getUserToken(): string {
    return localStorage.getItem('token') ?? '';
  }

  public removeUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    localStorage.removeItem('userCode');
    localStorage.removeItem('userIsAdmin');
    localStorage.removeItem('userToken');
  }
  // #endregion

  // #region results
  private _userDayResults: KeyValue<string, number>[] | undefined;
  public get userDayResults(): KeyValue<string, number>[] {
    if (this._userDayResults === undefined) {
      this._userDayResults = [];
      this.localstorageExtension.loadDayResults(this.getUserId()).subscribe((response: KeyValue<string, number>[]) => this._userDayResults = response);
    }

    return this._userDayResults;
  }

  private _SharedNettoResults: SharedNettoResult[] | undefined;
  public get sharedNettoResults(): SharedNettoResult[] {
    if (this._SharedNettoResults === undefined) {
      this._SharedNettoResults = [];
      this.localstorageExtension.loadSharedNettoResults(this.getUserId()).subscribe((response: SharedNettoResult[]) => this._SharedNettoResults = response);
    }

    return this._SharedNettoResults;
  }

  private _casinoNettoResults: KeyValue<string, KeyValue<string, number>[]>[] | undefined;
  public get casinoNettoResults(): KeyValue<string, KeyValue<string, number>[]>[] {
    if (this._casinoNettoResults === undefined) {
      this._casinoNettoResults = [];
      this.localstorageExtension.loadCasinoNettoResults(this.getUserId()).subscribe((response: KeyValue<string, KeyValue<string, number>[]>[]) => this._casinoNettoResults = response);
    }

    return this._casinoNettoResults;
  }

  private _periodNettoResults: ProfilePeriodResult[] | undefined;
  public get periodNettoResults(): ProfilePeriodResult[] {
    if (this._periodNettoResults === undefined) {
      this._periodNettoResults = [];
      this.localstorageExtension.loadPeriodNettoResults(this.getUserId()).subscribe((response: ProfilePeriodResult[]) => this._periodNettoResults = response);
    }

    return this._periodNettoResults;
  }

  private _typeNettoResults: KeyValue<string, KeyValue<string, number>[]>[] | undefined;
  public get typeNettoResults(): KeyValue<string, KeyValue<string, number>[]>[] {
    if (this._typeNettoResults === undefined) {
      this._typeNettoResults = [];
      this.localstorageExtension.loadTypeNettoResults(this.getUserId()).subscribe((response: KeyValue<string, KeyValue<string, number>[]>[]) => this._typeNettoResults = response);
    }

    return this._typeNettoResults;
  }
  // #endregion

  // #region casino
  private _casinos: Casino[] | undefined;
  public get casinos(): Casino[] {
    if (this._casinos === undefined) {
      this._casinos = [];
      this.localstorageExtension.loadCasinos().subscribe((response: Casino[]) => this._casinos = response);
    }

    return this._casinos;
  }

  private _userIgnoreCasinos: Casino[] | undefined;
  public get userIgnoreCasinos(): Casino[] {
    if (this._userIgnoreCasinos === undefined) {
      this._userIgnoreCasinos = [];
      this.localstorageExtension.loadCasinosByUser(this.getUserId()).subscribe((response: Casino[]) => this._userIgnoreCasinos = response);
    }

    return this._userIgnoreCasinos;
  }

  public getUserCasinos(): Casino[] {
    return this.casinos.filter(casino => this.userIgnoreCasinos.find(userCasino => userCasino.id === casino.id) !== undefined);
  }

  public getCasinoName(id: string): string {
    return this.casinos.find(casino => casino.id === id)?.name ?? '';
  }
  // #endregion

  // #region record
  private _allRecords: KeyValue<string, Record[]>[] | undefined;
  public get allRecords(): KeyValue<string, Record[]>[] {
    if (this._allRecords === undefined) {
      this._allRecords = [];
      this.localstorageExtension.loadAllRecords(this.getUserId()).subscribe((response: KeyValue<string, Record[]>[]) => this._allRecords = response);
    }
    return this._allRecords;
  }

  public getRecordsByUserId(userId: string): Record[] {
    return this.allRecords.find(record => record.key === userId)?.value ?? [];
  }

  private _recordsToday: Record[] | undefined;
  public get recordsToday(): Record[] {
    if (this._recordsToday === undefined) {
      this._recordsToday = [];
      this.localstorageExtension.loadRecordsToday(this.getUserId()).subscribe((response: Record[]) => this._recordsToday = response);
    }

    return this._recordsToday;
  }

  private _lastRecords: Record[][] | undefined;
  public get lastRecords(): Record[][] {
    if (this._lastRecords === undefined) {
      this._lastRecords = [];
      this.localstorageExtension.loadLastRecords(this.getUserId()).subscribe((response: Record[][]) => this._lastRecords = response);
    }

    return this._lastRecords;
  }
  // #endregion

  // #region recordType
  private _types: RecordType[] | undefined;
  public get types(): RecordType[] {
    if (this._types === undefined) {
      this._types = [];
      this.localstorageExtension.loadRecordTypes().subscribe((response: RecordType[]) => this._types = response);
    }

    return this._types;
  }

  private _userIgnoreTypes: RecordType[] | undefined;
  public get userIgnoreTypes(): RecordType[] {
    if (this._userIgnoreTypes === undefined) {
      this._userIgnoreTypes = [];
      this.localstorageExtension.loadRecordTypesByUser(this.getUserId()).subscribe((response: RecordType[]) => this._userIgnoreTypes = response);
    }

    return this._userIgnoreTypes;
  }

  public getUserTypes(): RecordType[] {
    return this.types.filter(type => this.userIgnoreTypes.find(userType => userType.id === type.id) !== undefined);
  }

  public getTypeName(id: string): string {
    return this.types.find(type => type.id === id)?.name ?? '';
  }
  // #endregion

  // #region connections
  private _users: User[] | undefined;
  public get users(): User[] {
    if (this._users === undefined) {
      this._users = [];
      this.localstorageExtension.loadUsers().subscribe((response: User[]) => this._users = response);
    }

    return this._users;
  }

  private _userConnections: User[] | undefined;
  public get userConnections(): User[] {
    if (this._userConnections === undefined) {
      this._userConnections = [];
      this.localstorageExtension.loadConnections(this.getUserId()).subscribe((response: User[]) => this._userConnections = response);
    }

    return this._userConnections;
  }

  public getUserConnectionName(id: string): string {
    return this.userConnections.find(connection => connection.id === id)?.name ?? '';
  }
  // #endregion
}
