import { Injectable } from '@angular/core';
import { CasinoService } from '../core/casino.service';
import { RecordTypeService } from '../core/record-type.service';
import { KeyValue } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public _recordTypes: KeyValue<string, string>[] = [];
  public _casinos: KeyValue<string, string>[] = [];

  public get casinos(): KeyValue<string, string>[] {
    if (this._casinos.length == 0)
      this._casino.getAll().subscribe((result: KeyValue<string, string>[]) => this._casinos = result);

    return this._casinos;
  }

  public get recordTypes(): KeyValue<string, string>[] {
    if (this._recordTypes.length == 0)
      this._recordType.getAll().subscribe((result: KeyValue<string, string>[]) => this._recordTypes = result);

    return this._recordTypes;
  }

  constructor(private _casino: CasinoService, private _recordType: RecordTypeService) { }
}
