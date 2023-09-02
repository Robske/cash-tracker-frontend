import { DatePipe, KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CasinoService } from 'src/app/service/core/casino.service';
import { RecordTypeService } from 'src/app/service/core/record-type.service';
import { Record } from 'src/app/model/record';
import { RecordService } from 'src/app/service/core/record.service';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { ProfileService } from 'src/app/service/general/profile.service';
import { ResultService } from 'src/app/service/general/result.service';

@Component({
  selector: 'app-record-create',
  templateUrl: './record-create.component.html',
  styleUrls: ['./record-create.component.scss']
})
export class RecordCreateComponent {
  public form?: FormGroup<any>;
  public today: string;
  public casinos: KeyValue<string, string>[] | undefined;
  public recordTypes: KeyValue<string, string>[] | undefined;
  public noteLength: number = 0;
  public createdRecord: boolean = false;
  public newRecord?: Record;
  public iconNote = faComment;

  constructor(private fb: FormBuilder, private datePipe: DatePipe, private _casino: CasinoService, public _result: ResultService,
    private _recordType: RecordTypeService, private _record: RecordService, public _localstorage: LocalstorageService) {
    this.today = datePipe.transform(new Date(), 'yyyy-MM-dd') || '2020-01-01';

    // get casinos and record types
    _casino.getAll().subscribe((casinos: KeyValue<string, string>[]) => this.casinos = casinos);
    _recordType.getAll().subscribe((recordTypes: KeyValue<string, string>[]) => this.recordTypes = recordTypes);

    this.form = this.form = this.fb.group({
      date: this.fb.nonNullable.control(this.today, { validators: [Validators.required] }),
      casino: this.fb.nonNullable.control('', { validators: [Validators.required,] }),
      recordType: this.fb.nonNullable.control('', { validators: [Validators.required,] }),
      deposit: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.min(0)] }),
      withdrawal: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.min(0)] }),
      note: this.fb.nonNullable.control(''),
    });

    this.form.get('recordType')?.valueChanges.subscribe(val => {
      if (val == '01gsrdhg3mw1k3js39affqpm33' ||
        val == '01gv62fx2y01bp2xf0p72z50z5' ||
        val == '01gx3y2jeyeh3298e2sd76qkhr')
        this.form?.controls['deposit'].setValue(0);
      else if (this.form?.value.deposit === 0)
        this.form?.controls['deposit'].setValue('');
    });

    this.form.get('note')?.valueChanges.subscribe(val => {
      this.noteLength = val.length;
    });
  }

  public onSubmit() {
    if (this.form?.valid) {
      const values = this.form.value;
      this.newRecord = {} as Record;

      this.newRecord.casino_id = values.casino;
      this.newRecord.user_id = this._localstorage.getUserId();
      this.newRecord.record_type_id = values.recordType;
      this.newRecord.deposit = parseFloat(values.deposit.toFixed(2)) ?? 0;
      this.newRecord.withdrawal = parseFloat(values.withdrawal.toFixed(2)) ?? 0;
      this.newRecord.date = values.date;
      this.newRecord.note = values.note;

      this.form.controls['deposit'].setValue('');
      this.form.controls['withdrawal'].setValue('');
      this.form.controls['note'].setValue('');

      this._record.create(this.newRecord).subscribe((x: boolean) => {
        this.createdRecord = x
        this._result.updateLastXByUser(this._localstorage.getUserId(), 5);
      });
    }
  }
}
