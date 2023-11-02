import { DatePipe, KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Record } from 'src/app/model/record';
import { RecordService } from 'src/app/service/core/record.service';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { ResultService } from 'src/app/service/general/result.service';
import { GeneralService } from 'src/app/service/general/general.service';

@Component({
  selector: 'app-record-create',
  templateUrl: './record-create.component.html',
  styleUrls: ['./record-create.component.scss']
})
export class RecordCreateComponent {
  public form?: FormGroup<any>;
  public today: string;
  public noteLength: number = 0;
  public createdRecord: boolean = false;
  public iconNote = faComment;

  private noDepositRecordTypes: string[] = ['01gsrdhg3mw1k3js39affqpm33', '01gv62fx2y01bp2xf0p72z50z5', '01gx3y2jeyeh3298e2sd76qkhr']

  constructor(private fb: FormBuilder, private datePipe: DatePipe, public _result: ResultService, public _general: GeneralService,
    private _record: RecordService, public _localstorage: LocalstorageService) {
    this.today = datePipe.transform(new Date(), 'yyyy-MM-dd') || '2020-01-01';

    this.form = this.fb.group({
      date: this.fb.nonNullable.control(this.today, { validators: [Validators.required] }),
      casino: this.fb.nonNullable.control('', { validators: [Validators.required,] }),
      recordType: this.fb.nonNullable.control('', { validators: [Validators.required,] }),
      deposit: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.min(0)] }),
      withdrawal: this.fb.nonNullable.control('', { validators: [Validators.required, Validators.min(0)] }),
      note: this.fb.nonNullable.control(''),
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

  public onSubmit() {
    if (this.form?.valid) {
      const values = this.form.value;
      let newRecord: Record = {} as Record;

      newRecord.casino_id = values.casino;
      newRecord.user_id = this._localstorage.getUserId();
      newRecord.record_type_id = values.recordType;
      newRecord.deposit = parseFloat(values.deposit.toFixed(2)) ?? 0;
      newRecord.withdrawal = parseFloat(values.withdrawal.toFixed(2)) ?? 0;
      newRecord.date = values.date;
      newRecord.note = values.note;

      if (this.noDepositRecordTypes.includes(values.recordType))
        this.form?.controls['deposit'].setValue(0);
      else
        this.form?.controls['deposit'].setValue('');

      this.form.controls['withdrawal'].setValue('');
      this.form.controls['note'].setValue('');

      this._record.create(newRecord).subscribe((x: boolean) => {
        this.createdRecord = x
        this._result.updateLastXByUser(this._localstorage.getUserId(), 5);
      });
    }
  }
}
