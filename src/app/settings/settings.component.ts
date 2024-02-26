import { Component } from '@angular/core';
import { LocalstorageService } from '../shared/service/localstorage.service';
import { UserService } from '../shared/service/api/user.service';
import { CasinoService } from '../shared/service/api/casino.service';
import { RecordtypeService } from '../shared/service/api/recordtype.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent {
  public math = Math;
  public casinoInput = new FormControl();
  public typeInput = new FormControl();

  constructor(private casino: CasinoService, public ls: LocalstorageService, private recordType: RecordtypeService, private user: UserService) { }

  public isIgnoreType(typeId: string) {
    return this.ls.userIgnoreTypes.find(x => x.id === typeId) === undefined;
  }

  public isIgnoreCasino(casinoId: string) {
    return this.ls.userIgnoreCasinos.find(x => x.id === casinoId) === undefined;
  }

  public isConnection(userId: string) {
    return this.ls.userConnections.find(x => x.id === userId) !== undefined;
  }

  public toggleType(typeId: string) {
    this.recordType.toggleRecordType(this.ls.getUserId(), typeId).subscribe((response: boolean) => { this.ls.loadUserTypes(); });
  }

  public toggleCasino(casinoId: string) {
    this.casino.toggleCasino(this.ls.getUserId(), casinoId).subscribe((response: boolean) => { this.ls.loadUserCasinos(); });
  }

  public toggleConnection(connectionId: string) {
    this.user.toggleConnection(this.ls.getUserId(), connectionId).subscribe((response: boolean) => { this.ls.loadUserConnections(); this.ls.loadAppData(); });
  }

  public onSubmitCasino() {
    if (this.casinoInput.value === null) return;

    let input = this.casinoInput.value;
    if (input.length > 3) {
      this.casinoInput.setValue("");
      this.casino.createCasino(this.ls.getUserId(), input).subscribe((response: boolean) => { this.ls.loadCasinos(); });
    }
  }
}
