import { KeyValue } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { faCaretRight, faCaretLeft, faCaretDown, faEye, faEyeSlash, faShuffle, faChartSimple, faCircleChevronUp } from '@fortawesome/free-solid-svg-icons';
import { RecordService } from 'src/app/service/core/record.service';
import { Stats } from 'src/app/model/stats';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { LocalstorageService } from 'src/app/service/general/localstorage.service';
import { CasinoService } from 'src/app/service/core/casino.service';
import { RecordTypeService } from 'src/app/service/core/record-type.service';
import { FormControl } from '@angular/forms';
import { ProfileService } from 'src/app/service/general/profile.service';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexTitleSubtitle
} from "ng-apexcharts";
import { GeneralService } from 'src/app/service/general/general.service';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  public chartOptions: ChartOptions;
  public showChart: boolean = false;

  public userId: string = '';
  public user: UserProfile | undefined;
  public userVisibleStats: Stats | undefined;
  public routeSubscription: Subscription | undefined;
  public noteInput = new FormControl();
  public amountOfRecords: number = 10;
  private monthNames: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
  ]
  public math = Math;
  public allUsers: KeyValue<string, string>[] = [];

  public iconCarotRight = faCaretRight;
  public iconCarotLeft = faCaretLeft;
  public iconCarotDown = faCaretDown;
  public iconNote = faComment;
  public iconShow = faEye;
  public iconHide = faEyeSlash;
  public iconReverse = faShuffle;
  public iconChart = faChartSimple;
  public iconScroll = faCircleChevronUp;

  constructor(private route: ActivatedRoute, public _record: RecordService, public _localstorage: LocalstorageService,
    private _casino: CasinoService, private _recordType: RecordTypeService, public _profile: ProfileService, public _general: GeneralService) {
    _record.resetFilters();

    this.noteInput.valueChanges.subscribe(async (note) => {
      _record.filterNote = note;
      _profile.updateFilters();
      this.updateChart();
    });

    this.chartOptions = {
      series: [
        {
          name: "",
          data: []
        }
      ],
      chart: {
        height: 425,
        type: "line"
      },
      title: {
        text: ""
      },
      xaxis: {
        categories: []
      }
    };
  }

  public ngOnInit(): void {
    this.routeSubscription = this.route.params.subscribe(
      (params: any) => {
        this.userId = params['userid'];
        this.updateChart();
      });
  }

  public hasValue(array: string[], value: string): boolean {
    return array.findIndex((x: string) => x === value) !== -1;
  }

  public getMonthName(month: string): string {
    return this.monthNames[Number(month) - 1];
  }

  public toggleChart() {
    this.updateChart();
    this.showChart = !this.showChart;
  }

  public updateChart() {
    if (this._profile.getUserData(this.userId).dayResults == undefined)
      return

    // get shallow copy
    let data = this._profile.getUserData(this.userId).dayResults

    if (data.length > 20)
      data.unshift({ key: "T", value: 0 })

    this.chartOptions = {
      series: [
        {
          name: "Net in €",
          data: data.map((x: KeyValue<string, number>) => x.value)
        }
      ],
      chart: {
        height: 425,
        type: "line"
      },
      title: {
        text: this._profile.getUserData(this.userId).name
      },
      xaxis: {
        categories: data.map((x: KeyValue<string, number>) => x.key.split("T")[0])
      },

    };
  }

  public scrollToTop() {
    window.scrollTo(0, 0);
  }
}

class UserProfile {
  id!: string;
  name!: string;
  stats!: Stats;
  visibleStats!: Stats;
}