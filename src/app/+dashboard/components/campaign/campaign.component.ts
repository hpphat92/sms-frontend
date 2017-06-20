import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {
  DashboardService
} from '../../dashboard.service';

interface CampaignMetaModel {
  list: string;
  upload_id: string;
}

interface CampaignListsModel {
  sql: string;
  _id: string;
}

interface CampaignModel {
  account_id: string;
  campaign_id: string;
  content: string;
  delivered: number;
  enabled: boolean;
  name: string;
  schedule_date: string;
  status: string;
  type: string;
  _id: string;
  meta: CampaignMetaModel;
  lists: CampaignListsModel[]
}

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'campaign',  // <campaign></campaign>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'campaign.template.html',
  styleUrls: []
})
export class CampaignComponent {
  public data: CampaignModel[] = [];

  constructor(private _dashboardService: DashboardService) {
    _dashboardService.getRecentPrograms().then((resp: CampaignModel[]) => {
      this.data = resp;
    });
  }
}
