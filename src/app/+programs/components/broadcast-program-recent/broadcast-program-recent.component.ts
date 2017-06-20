import {
  Component, Input, OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { ProgramsService } from '../../programs.service';
import { ProgramFilterModel } from '../../programs.model';

import{
  AppConstant
} from '../../../app.constant';

import * as moment from 'moment';
import { Router } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'broadcast-program-recent',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'broadcast-program-recent.template.html',
  styleUrls: ['broadcast-program-recent.style.scss']
})
export class BroadcastProgramRecentComponent implements OnInit, OnDestroy {
  @Input() public campaignId: string;

  // Kendo grid configuration
  public view: GridDataResult;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 7
  };

  public broadcastProgramFilter: ProgramFilterModel;

  public appConstant = AppConstant;

  public searchText = new FormControl();

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _programsService: ProgramsService,
              private _router: Router) {

  }

  public ngOnInit(): void {
    this.broadcastProgramFilter = {
      status: 'completed',
      since: moment().subtract(7, 'day').format(this.appConstant.format.moment.sortDate),
      type: 'broadcast',
      campaign_id: this.campaignId,
      page: 1,
      limit: 7,
      sort: '',
      search: ''
    };

    this.loadList();

    // Change search text
    this.searchText.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((term) => {
        this.broadcastProgramFilter.page = 1;
        this.gridState.skip = 0;
        this.broadcastProgramFilter.search = term;

        this.loadList();
      });
  }

  public onStateChange(state: State) {
    this.gridState = state;
    if (state.sort.length) {
      this.broadcastProgramFilter.sort = state.sort[0].field;
      this.gridState.sort = state.sort;
    }

    this.broadcastProgramFilter.page = (state.skip / this.broadcastProgramFilter.limit) + 1;
    this.gridState.skip = state.skip;
  }

  public addHandler() {
    // create button clicked
    this._router.navigate(['campaigns', this.campaignId, 'programs', 'broadcast', 'create']);
  }

  public loadList() {
    // Get list data when component init
    this._programsService.getList(this.broadcastProgramFilter)
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data: any) => {
        this.view = {
          data: data.data,
          total: data.total
        };
      });
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
