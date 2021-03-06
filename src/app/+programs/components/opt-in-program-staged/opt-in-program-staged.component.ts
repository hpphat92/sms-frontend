import {
  Component, Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import {
  ToastrService
} from 'ngx-toastr';

import { ProgramsService } from '../../programs.service';
import { ProgramFilterModel } from '../../programs.model';
import { Router } from '@angular/router';
import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'opt-in-program-staged',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'opt-in-program-staged.template.html',
  styleUrls: ['opt-in-program-staged.style.scss']
})
export class OptInProgramStagedComponent implements OnInit, OnDestroy {

  @Input() public campaignId: string;

  // Kendo grid configuration
  public view: GridDataResult;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 7
  };

  // searching keywords
  public searchText = new FormControl();

  public optInProgramFilter: ProgramFilterModel;

  public _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _programsService: ProgramsService,
              private _toast: ToastrService,
              private _router: Router,
              private _confirmService: ConfirmService) {
  }

  public ngOnInit(): void {
    this.optInProgramFilter = {
      status: 'staged',
      since: '',
      type: 'optin',
      campaign_id: this.campaignId,
      page: 1,
      limit: 7,
      sort: '',
      search: ''
    };

    // Get list data when component init
    this.loadList();

    // Change search text
    this.searchText.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((term) => {
        this.optInProgramFilter.page = 1;
        this.gridState.skip = 0;
        this.optInProgramFilter.search = term;
        this.loadList();
      });
  }

  public onStateChange(state: State) {
    this.gridState = state;

    if (state.sort.length) {
      this.optInProgramFilter.sort = state.sort[0].field;
      this.gridState.sort = state.sort;
    }

    this.optInProgramFilter.page = (state.skip / this.optInProgramFilter.limit) + 1;
    this.gridState.skip = state.skip;

    this.loadList();
  }

  /**
   * Add button callback
   * @param event
   */
  public addHandler() {
    // create edit item model
    this._router.navigate(['campaigns', this.campaignId, 'programs', 'opt-in', 'create']);
  }

  /**
   * Edit button callback
   * @param dataItem
   */
  public editHandler(dataItem) {
    // Get details of program
    this._router.navigate(['campaigns', this.campaignId,
      'programs', 'opt-in', dataItem._id, 'edit']);
  }

  /**
   * Remove button callback
   * @param dataItem
   */
  public removeHandler(dataItem) {
    let message = `Are you sure you want to delete <b>${dataItem.name}</b>?`;

    this._confirmService.show(message, (action) => {
      if (action === 'Yes') {
        this._programsService.remove(dataItem._id).subscribe((data) => {
          this._toast.success('Delete program successful.', 'Success');

          this.onStateChange(this.gridState);
        });
      }
    }, true);
  }

  public loadList() {
    this._programsService.getList(this.optInProgramFilter)
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data: any) => {
        this.view = {
          data: data.data,
          total: data.total
        };
      });
  }

  /**
   * Destroy component
   */
  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
