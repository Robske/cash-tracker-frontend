import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { CasinoService } from 'src/app/service/core/casino.service';
import { RecordTypeService } from 'src/app/service/core/record-type.service';
import { RecordService } from 'src/app/service/core/record.service';
import { Record } from 'src/app/model/record';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';
import { Stats } from 'src/app/model/stats';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faPencil, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from 'src/app/service/general/profile.service';

@Component({
  selector: 'app-record-manage',
  templateUrl: './record-manage.component.html',
  styleUrls: ['./record-manage.component.scss']
})
export class RecordManageComponent {
  public casinos: KeyValue<string, string>[] = [];
  public recordTypes: KeyValue<string, string>[] = [];
  public records: Record[] = [];
  public amountOfRecords: number = 15;
  public edit: boolean = false;
  public editRecord: Record | undefined;
  public form?: FormGroup<any>;


  public iconEdit = faPencil;
  public iconClose = faXmark;
  public iconRemove = faTrash;

  constructor(private _casino: CasinoService, private _recordType: RecordTypeService,
    private _record: RecordService, public _localstorage: LocalstorageService,
    private fb: FormBuilder, public _profile: ProfileService) {
    _casino.getAll().subscribe((casinos: KeyValue<string, string>[]) => this.casinos = casinos);
    _recordType.getAll().subscribe((recordTypes: KeyValue<string, string>[]) => this.recordTypes = recordTypes);
    // this.records = _profile.getUserData(_localstorage.getUserId()).stats.records;

    if (_profile.getUserData(_localstorage.getUserId()).stats != undefined)
      this.records = _profile.getUserData(_localstorage.getUserId()).stats.records;
    else
      _record.getUserRecords(_localstorage.getUserId(), false).subscribe((stats: Stats) => this.records = stats.records);
  }

  public setEditRecord(id: string) {
    this.editRecord = this.records.find((x: Record) => x.record_id == id);

    if (this.editRecord)
      this.form = this.fb.group({
        casino: this.fb.nonNullable.control(this.editRecord.casino_id, { validators: [Validators.required,] }),
        recordType: this.fb.nonNullable.control(this.editRecord.record_type_id, { validators: [Validators.required,] }),
        deposit: this.fb.nonNullable.control(this.editRecord.deposit, { validators: [Validators.required, Validators.min(0)] }),
        withdrawal: this.fb.nonNullable.control(this.editRecord.withdrawal, { validators: [Validators.required, Validators.min(0)] }),
        note: this.fb.nonNullable.control(this.editRecord.note.length > 0 ? this.editRecord.note : '', { validators: [Validators.maxLength(250)] }),
      });
  }

  public deleteRecord(id: string) {
    this._record.delete(id).subscribe(response => {
      this._record.getUserRecords(this._localstorage.getUserId(), false).subscribe((stats: Stats) => this.records = stats.records);
    });
  }

  public onSubmit() {
    if (this.form?.valid && this.editRecord) {
      const values = this.form.value;
      this.editRecord.casino_id = values.casino;
      this.editRecord.record_type_id = values.recordType;
      this.editRecord.deposit = parseFloat(values.deposit.toFixed(2)) ?? 0;
      this.editRecord.withdrawal = parseFloat(values.withdrawal.toFixed(2)) ?? 0;
      this.editRecord.note = values.note;

      this._record.update(this.editRecord).subscribe(response => {
        this._record.getUserRecords(this._localstorage.getUserId(), false).subscribe((stats: Stats) => {
          this.records = stats.records;
          this.editRecord = undefined;
        });
      });
    }
  }
}
