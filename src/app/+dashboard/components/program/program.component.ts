import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {
  DashboardService
} from '../../dashboard.service';

import * as _ from 'lodash';

interface OtherModel {
  campaignTotal: number;
  mailListsTotal: number;
  subscriberTotal: number;
}

interface OpInProgramModel {
  liveProgramTotal: number;
  keywordTotal: number;
  stagedProgramTotal: number;
}

interface BroadcastProgramModel {
  scheduledProgramTotal: number;
  recentTotal: number;
  stagedProgramTotal: number;
}

interface ProgramMetaModel {
  list: string;
  upload_id: string;
}

interface ProgramListsModel {
  sql: string;
  _id: string;
}

interface ProgramModel {
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
  meta: ProgramMetaModel;
  lists: ProgramListsModel[];
}

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'program',  // <program></program>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'program.template.html',
  styleUrls: ['program.style.scss']
})
export class ProgramComponent {
  public other: OtherModel = {
    subscriberTotal: 0,
    campaignTotal: 0,
    mailListsTotal: 0
  };
  public opInProgram: OpInProgramModel = {
    liveProgramTotal: 0,
    stagedProgramTotal: 0,
    keywordTotal: 0
  };
  public broadcastProgram: BroadcastProgramModel = {
    stagedProgramTotal: 0,
    recentTotal: 0,
    scheduledProgramTotal: 0
  };

  constructor(private _dashboardService: DashboardService) {
    _dashboardService.getPrograms().then((resp: ProgramModel[]) => {
      let broadcastPrograms: ProgramModel[] = _.filter(resp, {type: 'broadcast'});
      let optInPrograms: ProgramModel[] = _.filter(resp, {type: 'optin'});

      this.opInProgram.liveProgramTotal = _.filter(optInPrograms, {status: 'active'}).length;
      this.opInProgram.stagedProgramTotal = _.filter(optInPrograms, {status: 'staged'}).length;

      this.broadcastProgram.stagedProgramTotal =
        _.filter(broadcastPrograms, {status: 'staged'}).length;
      this.broadcastProgram.scheduledProgramTotal =
        _.filter(broadcastPrograms, {status: 'scheduled'}).length;
    });

    _dashboardService.getCampaigns().then((resp) => {
      this.other.campaignTotal = resp.length;
    });

    _dashboardService.getBroadcastProgramsLast7Days().then((resp) => {
      this.broadcastProgram.recentTotal = resp.length;
    });

    _dashboardService.getMailingLists().then((resp) => {
      this.other.mailListsTotal = resp.length;
    });

    _dashboardService.getKeywords().then((resp) => {
      this.opInProgram.keywordTotal = resp.length;
    });
  }
}
