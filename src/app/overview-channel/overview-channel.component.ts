import { Component } from '@angular/core';
import { Record } from '../shared/model/record';
import { RecordService } from '../shared/service/api/record.service';
import { IconDefinition, faComment } from '@fortawesome/free-solid-svg-icons';
import { LocalstorageService } from '../shared/service/localstorage.service';
import { LocalstorageExtensionService } from '../shared/service/localstorage-extension.service';

@Component({
  selector: 'app-overview-channel',
  templateUrl: './overview-channel.component.html',
  styleUrls: ['./overview-channel.component.less']
})
export class OverviewChannelComponent {
  public recordsToday: Record[] = [];
  public faComment: IconDefinition = faComment;
  public today: Date = new Date();
  constructor(public ls: LocalstorageService, public lse: LocalstorageExtensionService, record: RecordService) {
    setInterval(() => this.today = new Date(), 10000);
  }
}
