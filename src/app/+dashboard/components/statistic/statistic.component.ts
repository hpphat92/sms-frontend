import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {
  DashboardService
} from '../../dashboard.service';

interface StatisticModel {
  inbound: number;
  outbound: number;
  total: number;
}

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'statistic',  // <statistic></statistic>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'statistic.template.html',
  styleUrls: []
})
export class StatisticComponent {
  public dailyStatistic: StatisticModel;
  public monthToDateStatistic: StatisticModel;

  constructor(private _dashboardService: DashboardService) {
    this.dailyStatistic = {
      inbound: 0,
      outbound: 0,
      total: 0
    };

    this.monthToDateStatistic = {
      inbound: 0,
      outbound: 0,
      total: 0
    };

    _dashboardService.getDailyStatistic().then((resp: StatisticModel) => {
      this.dailyStatistic = resp;
    });

    _dashboardService.getMonthToDateStatistic().then((resp: StatisticModel) => {
      this.monthToDateStatistic = resp;
    });
  }
}
