import { Component } from '@angular/core';
import { LocalstorageService } from '../shared/service/localstorage.service';
import { UserService } from '../shared/service/api/user.service';
import { CasinoService } from '../shared/service/api/casino.service';
import { RecordtypeService } from '../shared/service/api/recordtype.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent {
  public math = Math;

  constructor(private casino: CasinoService, public ls: LocalstorageService, private recordType: RecordtypeService, private user: UserService) { }

  public isIgnoreType(typeId: string) {
    return this.ls.userIgnoreTypes.find(x => x.id === typeId) === undefined;
  }

  public toggleType(typeId: string) {
    this.recordType.toggleRecordType(this.ls.getUserId(), typeId).subscribe((response: boolean) => { this.ls.loadAppData(); });
  }

  public isIgnoreCasino(casinoId: string) {
    return this.ls.userIgnoreCasinos.find(x => x.id === casinoId) === undefined;
  }

  public toggleCasino(casinoId: string) {
    this.casino.toggleCasino(this.ls.getUserId(), casinoId).subscribe((response: boolean) => { this.ls.loadAppData(); });
  }

  public isConnection(userId: string) {
    return this.ls.userConnections.find(x => x.id === userId) !== undefined;
  }

  public toggleConnection(connectionId: string) {
    this.user.toggleConnection(this.ls.getUserId(), connectionId).subscribe((response: boolean) => { this.ls.loadAppData(); });
  }
}