import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocalstorageService } from '../shared/service/localstorage.service';
import { IconDefinition, faMugHot } from '@fortawesome/free-solid-svg-icons';
import { Record } from '../shared/model/record';
import { KeyValue } from '@angular/common';
import { ProfilePeriodResult } from '../shared/model/ProfilePeriodResult';
import { LocalstorageExtensionService } from '../shared/service/localstorage-extension.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.less']
})
export class ProfileComponent {
  public amountOfRecordsShown: number = 8;
  public faCoffee: IconDefinition = faMugHot;
  public filterCasinos: string[] = [];
  public filterRecordTypes: string[] = [];
  public filteredRecordsLength: number = 0;
  public math = Math;
  public routeSubscription: Subscription | undefined;
  public userId: string | undefined;
  public recordStats: RecordStats = { amount: 0, deposit: 0, withdraw: 0, netto: 0 };

  constructor(public ls: LocalstorageService, public lse: LocalstorageExtensionService, private route: ActivatedRoute) {
    var x = ls.casinoNettoResults;
  }

  public ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(
      (params: any) => {
        this.userId = params['userId'];
      });
  }

  public getMonthNameFromFullDate(dayMonthYear: string): string {
    return this.lse.monthNamesLong[Number(dayMonthYear.split('/')[0]) - 1];
  }

  public getMonthNameFromDate(yearMonth: string): string {
    return this.lse.monthNamesLong[Number(yearMonth.split('-')[1]) - 1];
  }

  public getFilteredRecords(): Record[] {
    let records: Record[] = this.ls.getRecordsByUserId(this.userId ?? '');
    if (this.filterCasinos.length > 0)
      records = records.filter((item) => this.filterCasinos.includes(item.casinoId ?? ''));
    if (this.filterRecordTypes.length > 0)
      records = records.filter((item) => this.filterRecordTypes.includes(item.recordTypeId ?? ''));

    return records;
  }

  public getRecordStats(): RecordStats {
    let records: Record[] = this.getFilteredRecords();
    let stats: RecordStats = { amount: 0, deposit: 0, withdraw: 0, netto: 0 };
    records.forEach((item) => {
      stats.amount++;
      stats.deposit += item.deposit;
      stats.withdraw += item.withdrawal;
    });
    stats.netto = stats.withdraw - stats.deposit;
    return stats;
  }

  public getCasinoResults(): KeyValue<string, number>[] {
    return this.ls.casinoNettoResults.find((item) => item.key == this.userId)?.value ?? [];
  }

  public getTypeResults(): KeyValue<string, number>[] {
    return this.ls.typeNettoResults.find((item) => item.key == this.userId)?.value ?? [];
  }

  public getPeriodResults(): ProfilePeriodResult {
    let result: ProfilePeriodResult | undefined = this.ls.periodNettoResults.find((item) => item.userId == this.userId);
    if (result == undefined)
      result = { userId: this.userId ?? '', months: [], years: [] };

    return result;
  }

  public changeAmountOfShownRecords(): void {
    if (this.amountOfRecordsShown == 8) {
      this.amountOfRecordsShown = Number.MAX_VALUE;
    }
    else {
      this.amountOfRecordsShown = 8;
    }
  }

  // Casino functions
  public addOrRemoveCasinoFilter(casinoId: string): void {
    if (this.checkCasinoFilter(casinoId))
      this.filterCasinos.splice(this.filterCasinos.indexOf(casinoId), 1);
    else
      this.filterCasinos.push(casinoId);
  }

  public checkCasinoFilter(casinoId: string): boolean {
    return this.filterCasinos.includes(casinoId);
  }

  public getUniqueCasinos(): string[] {
    let casinos: string[] = [...new Set(this.ls.getRecordsByUserId(this.userId ?? '').map((item) => item.casinoId ?? ''))];
    casinos.sort((a, b) => this.ls.getUserCasinoName(a).localeCompare(this.ls.getUserCasinoName(b)));
    return casinos;
  }

  // RecordType functions
  public addOrRemoveRecordTypeFilter(recordTypeId: string): void {
    if (this.checkRecordTypeFilter(recordTypeId))
      this.filterRecordTypes.splice(this.filterRecordTypes.indexOf(recordTypeId), 1);
    else
      this.filterRecordTypes.push(recordTypeId);
  }

  public checkRecordTypeFilter(recordTypeId: string): boolean {
    return this.filterRecordTypes.includes(recordTypeId);
  }

  public getUniqueRecordTypes(): string[] {
    let recordTypes: string[] = [...new Set(this.ls.getRecordsByUserId(this.userId ?? '').map((item) => item.recordTypeId ?? ''))];
    recordTypes.sort((a, b) => this.ls.getUserTypeName(a).localeCompare(this.ls.getUserTypeName(b)));
    return recordTypes;
  }
}


export interface RecordStats {
  amount: number;
  deposit: number;
  withdraw: number;
  netto: number;
}