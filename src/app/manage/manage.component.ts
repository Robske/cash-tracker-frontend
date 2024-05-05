import { Component } from '@angular/core';
import { LocalstorageService } from '../shared/service/localstorage.service';
import { Record } from '../shared/model/record';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecordService } from '../shared/service/api/record.service';
import { LocalstorageExtensionService } from '../shared/service/localstorage-extension.service';
import { IconDefinition, faPen, faXmark, faTrash } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.less']
})
export class ManageComponent {
  public iconEdit: IconDefinition = faPen;
  public iconRemove: IconDefinition = faTrash;
  public iconClose: IconDefinition = faXmark;
  public editRecord: Record | undefined;
  public form?: FormGroup<any>;
  public maxShownRecords: number = 100;

  constructor(private fb: FormBuilder, public ls: LocalstorageService, public lse: LocalstorageExtensionService, private record: RecordService) { }

  public setEditRecord(recordId: string) {
    this.editRecord = this.ls.getRecordsByUserId(this.ls.getUserId()).find((x: Record) => x.id == recordId);

    if (this.editRecord)
      this.form = this.fb.group({
        casino: this.fb.nonNullable.control(this.editRecord.casinoId, { validators: [Validators.required,] }),
        recordType: this.fb.nonNullable.control(this.editRecord.recordTypeId, { validators: [Validators.required,] }),
        deposit: this.fb.nonNullable.control(this.editRecord.deposit, { validators: [Validators.required, Validators.min(0)] }),
        withdrawal: this.fb.nonNullable.control(this.editRecord.withdrawal, { validators: [Validators.required, Validators.min(0)] }),
        note: this.fb.nonNullable.control(this.editRecord.notes.length > 0 ? this.editRecord.notes.replace(/<a\b[^>]*>/i,"").replace(/<\/a>/i, "") : '', { validators: [Validators.maxLength(250)] }),
      });
  }

  public deleteRecord(id: string) {
    this.record.delete(id, this.ls.getUserId()).subscribe(response => this.ls.loadAppData());
  }

  public onSubmit() {
    if (this.form?.valid && this.editRecord) {
      const values = this.form.value;
      this.editRecord.casinoId = values.casino;
      this.editRecord.recordTypeId = values.recordType;
      this.editRecord.deposit = parseFloat(values.deposit.toFixed(2)) ?? 0;
      this.editRecord.withdrawal = parseFloat(values.withdrawal.toFixed(2)) ?? 0;
      this.editRecord.notes = values.note;

      this.record.update(this.editRecord).subscribe(response => {
        this.editRecord = undefined;
        this.ls.loadAppData();
      });
    }
  }
}
