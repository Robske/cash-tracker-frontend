import { Component } from '@angular/core';
import { LocalstorageService } from '../shared/service/localstorage.service';
import { DatePipe, KeyValue } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Record } from '../shared/model/record';
import { RecordService } from '../shared/service/api/record.service';
import { LocalstorageExtensionService } from '../shared/service/localstorage-extension.service';
import { IconDefinition, faComment, faCopy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.less']
})
export class OverviewComponent {

  private noDepositRecordTypes: string[] = ['01gsrdhg3mw1k3js39affqpm33', '01gv62fx2y01bp2xf0p72z50z5', '01gx3y2jeyeh3298e2sd76qkhr'];
  public faComment: IconDefinition = faComment;
  public faCopy: IconDefinition = faCopy;
  public createdRecord: boolean = false;
  public casinos: KeyValue<string, string>[] = [];
  public recordTypes: KeyValue<string, string>[] = [];
  public dayResults: KeyValue<string, number>[] = [];
  public form?: FormGroup<any>;
  public noteLength: number = 0;
  public today: string;

  public header: string = '';
  public weekday: string = '';
  public daynumber: number = 0;
  public month: string = '';
  public todayDate: Date = new Date();

  constructor(private datePipe: DatePipe, private formBuilder: FormBuilder, public ls: LocalstorageService, public lse: LocalstorageExtensionService, private record: RecordService) {
    this.today = datePipe.transform(new Date(), 'yyyy-MM-dd') || '2020-01-01'
    this.setHeader();
    setInterval(() => this.today = datePipe.transform(new Date(), 'yyyy-MM-dd') || '2020-01-01');
    setInterval(() => this.setHeader, 10000);

    this.form = this.formBuilder.group({
      date: this.formBuilder.nonNullable.control(this.today, { validators: [Validators.required] }),
      casino: this.formBuilder.nonNullable.control('', { validators: [Validators.required,] }),
      recordType: this.formBuilder.nonNullable.control('', { validators: [Validators.required,] }),
      deposit: this.formBuilder.nonNullable.control('', { validators: [Validators.required, Validators.min(0)] }),
      withdrawal: this.formBuilder.nonNullable.control('', { validators: [Validators.required, Validators.min(0)] }),
      note: this.formBuilder.nonNullable.control(''),
    });

    this.form.get('recordType')?.valueChanges.subscribe(val => {
      this.createdRecord = false;
      if (this.noDepositRecordTypes.includes(val))
        this.form?.controls['deposit'].setValue(0);
      else if (this.form?.value.deposit === 0)
        this.form?.controls['deposit'].setValue('');
    });

    this.form.get('note')?.valueChanges.subscribe(val => {
      this.noteLength = val.length;
    });
  }

  public uniqueRecordCombinations(): Record[] {
    let uniqueRecords: Record[] = [];

    for (let index = 0; index < this.ls.recordsToday.length; index++) {
      const record = this.ls.recordsToday[index];

      if (this.ls.userIgnoreTypes.find(type => type.id == record.recordTypeId) === undefined || this.ls.userIgnoreCasinos.find(casino => casino.id == record.casinoId) === undefined)
        continue;

      if (uniqueRecords.length === 0)
        uniqueRecords.push(record);
      else if (uniqueRecords.find(r => r.casinoId === record.casinoId && r.recordTypeId === record.recordTypeId && r.deposit == record.deposit) === undefined)
        uniqueRecords.push(record);
    };

    // sort on casino, record type and deposit
    uniqueRecords.sort((a, b) => {
      if (a?.casinoId > b.casinoId) return 1;
      if (a.casinoId < b.casinoId) return -1;
      if (a.recordTypeId > b.recordTypeId) return 1;
      if (a.recordTypeId < b.recordTypeId) return -1;
      if (a.deposit > b.deposit) return 1;
      if (a.deposit < b.deposit) return -1;
      return 0;
    });

    return uniqueRecords;
  }

  public copyToForm(record: Record): void {
    this.form?.controls['casino'].setValue(record.casinoId);
    this.form?.controls['recordType'].setValue(record.recordTypeId);
    this.form?.controls['deposit'].setValue(record.deposit);
  }

  private setHeader(): void {
    this.todayDate = new Date();
    this.weekday = this.todayDate.toLocaleString('default', { weekday: 'long' });
    this.weekday = this.lse.weekdays[this.todayDate.getDay()];
    this.daynumber = this.todayDate.getDate();
    this.month = this.lse.monthNamesLong[this.todayDate.getMonth()]

    this.header = this.weekday + ', ' + this.daynumber + ' ' + this.month;
    this.header = this.header[0].toUpperCase() + this.header.slice(1);
  }

  public onSubmit() {
    if (this.form?.valid) {
      const values = this.form.value;
      let newRecord: Record = {} as Record;

      newRecord.casinoId = values.casino;
      newRecord.userId = this.ls.getUserId();
      newRecord.recordTypeId = values.recordType;
      newRecord.deposit = parseFloat(values.deposit.toFixed(2)) ?? 0;
      newRecord.withdrawal = parseFloat(values.withdrawal.toFixed(2)) ?? 0;
      newRecord.date = values.date;
      newRecord.notes = values.note;

      if (this.noDepositRecordTypes.includes(values.recordType))
        this.form?.controls['deposit'].setValue(0);
      else
        this.form?.controls['deposit'].setValue('');

      this.form.controls['withdrawal'].setValue('');
      this.form.controls['note'].setValue('');

      this.record.create(newRecord).subscribe((response: any) => {
        this.createdRecord = response;
        this.ls.loadAppData();
      });
    }
  }
}
