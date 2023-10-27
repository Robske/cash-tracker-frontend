import { KeyValue } from '@angular/common';
import { Component } from '@angular/core';
import { ConnectionService } from 'src/app/service/core/connection.service';
import { UserService } from 'src/app/service/core/user.service';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';
import { faLinkSlash, faLink } from '@fortawesome/free-solid-svg-icons';
import { ProfileService } from 'src/app/service/general/profile.service';

@Component({
  selector: 'app-user-connection',
  templateUrl: './user-connection.component.html',
  styleUrls: ['./user-connection.component.scss']
})
export class UserConnectionComponent {
  public allUsers: KeyValue<string, string>[] = [];
  public connections: KeyValue<string, string>[] = [];

  public iconLink = faLink;
  public iconUnlink = faLinkSlash;

  constructor(private _connection: ConnectionService, private _user: UserService, public _localstorage: LocalstorageService, private _profile: ProfileService) {
    this.updateData();
  }

  private updateData() {
    this._user.getAll().subscribe((users: KeyValue<string, string>[]) => this.allUsers = users);
    this._connection.getConnectionsByUser(this._localstorage.getUserId()).subscribe((connections: KeyValue<string, string>[]) => this.connections = connections);
    this._profile.usersData = [];
  }

  public deleteConnection(target: string) {
    this._connection.delete(this._localstorage.getUserId(), target).subscribe((x: any) => this.updateData());
  }

  public createConnection(target: string) {
    this._connection.create(this._localstorage.getUserId(), target).subscribe((x: any) => this.updateData());
  }

  public hasValue(array: KeyValue<string, string>[], value: string): boolean {
    return array.findIndex((x: KeyValue<string, string>) => x.key === value) !== -1;
  }
}
