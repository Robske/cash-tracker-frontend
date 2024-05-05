import { Component } from '@angular/core';
import { Record } from '../shared/model/record';
import { RecordService } from '../shared/service/api/record.service';
import { IconDefinition, faComment, faRotate } from '@fortawesome/free-solid-svg-icons';
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
  public faRotate: IconDefinition = faRotate;
  public today: Date = new Date();

  constructor(public ls: LocalstorageService, public lse: LocalstorageExtensionService, record: RecordService) {
    setInterval(() => this.today = new Date(), 10000);
  }

  public getNettoResultSortedByToday() {
    return this.ls.sharedNettoResults.sort((a, b) => b.today - a.today);
  }

  public getNettoResultSortedByMonth() {
    return this.ls.sharedNettoResults.sort((a, b) => b.month - a.month);
  }

  public getNettoResultSortedByAlltime() {
    return this.ls.sharedNettoResults.sort((a, b) => b.alltime - a.alltime);
  }
}
