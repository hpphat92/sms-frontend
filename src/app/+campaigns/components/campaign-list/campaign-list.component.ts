import {
  Component, OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Observable } from 'rxjs/Observable';

import {
  State
} from '@progress/kendo-data-query';

import {
  GridDataResult,
} from '@progress/kendo-angular-grid';

import { CampaignService } from '../../campaigns.service';

import { CampaignModel } from '../../campaign.model';

import {
  DialogCloseResult,
  DialogRef,
  DialogService
} from '@progress/kendo-angular-dialog';

import {
  ToastrService
} from 'ngx-toastr';

import { Router } from '@angular/router';

import { CampaignCreateOrUpdateComponent } from '../create-or-update/create-or-update.component';
import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'campaign-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'campaign-list.template.html',
  styleUrls: ['campaign-list.style.scss']
})
export class CampaignListComponent implements OnInit, OnDestroy {

  // Kendo grid configuration
  public view: Observable<GridDataResult>;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  // searching keywords
  public searchText = new FormControl();

  // edit item
  public editDataItem: CampaignModel;

  public isWaiting: boolean = false;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _campaignService: CampaignService,
              private _dialogService: DialogService,
              private _toast: ToastrService,
              private _router: Router,
              private _confirmService: ConfirmService) {
  }

  public ngOnInit(): void {
    // datasource for kendo-grid
    // call next() inside service to push data to data source
    this.view = this._campaignService.map((data: any) => {
      return {
        data: data.data,
        total: data.total
      };
    }).takeUntil(this._ngUnsubscribe);

    // Get list data when component init
    this.getCampaigns();

    // Change search text
    this.searchText.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((term) => {
        this.gridState.skip = 0;

        this.getCampaigns(term);
      });
  }

  public onStateChange(state: State) {
    this.gridState = state;
    this.getCampaigns();
  }

  /**
   * Add button callback
   * @param event
   */
  public addHandler() {
    // create edit item model
    this.editDataItem = new CampaignModel();

    const dialog: DialogRef = this._dialogService.open({
      title: `Create Campaign`,
      content: CampaignCreateOrUpdateComponent
    });

    const dialogInstance = dialog.content.instance;
    dialogInstance.modalInstance = dialog;
    dialogInstance.model = this.editDataItem;
    dialogInstance.isNew = true;

    dialog.result.subscribe((result: any) => {
      if (result.success) {
        // Update grid
        this.onStateChange(this.gridState);
      }
    });
  }

  /**
   * Edit button callback
   * @param dataItem
   */
  public editHandler(dataItem) {
    if (!this.isWaiting) {
      this.isWaiting = true;

      // Get details of campaign
      this._campaignService.getById(dataItem._id)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {
          this.isWaiting = false;

          // Bind remote data to model
          this.editDataItem = new CampaignModel(dataItem);

          const dialog: DialogRef = this._dialogService.open({
            title: `Edit: ${data.name}`,
            content: CampaignCreateOrUpdateComponent
          });

          const dialogInstance = dialog.content.instance;
          dialogInstance.modalInstance = dialog;
          dialogInstance.model = data;

          dialog.result
            .takeUntil(this._ngUnsubscribe)
            .subscribe((result: any) => {
              if (result.success) {
                // Update grid
                this.onStateChange(this.gridState);
              }
            });
        });
    }

  }

  /**
   * Remove button callback
   * @param dataItem
   */
  public archiveCampaign(dataItem) {
    // Show dialog

    let message = `Are you sure you want to archive the ${dataItem.name} campaign?`;

    this._confirmService.show(message, (action) => {
      if (action === 'Yes') {
        this._campaignService
          .archive(dataItem._id)
          .takeUntil(this._ngUnsubscribe)
          .subscribe((data) => {
            this._toast.success('Archive campaign successful.', 'Success');

            this.onStateChange(this.gridState);
          });
      }
    });
  }

  /**
   * Manage campaign button callback
   */
  public manageCampaign(dataItem) {
    this._router.navigate(['/campaigns', dataItem._id, 'programs']);
  }

  /**
   * New broadcast button callback
   */
  public newBroadcast(dataItem) {
    // console.log('add campaign');
    this._router.navigate(['campaigns', dataItem._id, 'programs', 'broadcast', 'create']);
  }

  public filter($event) {
    // this._campaignService.getList($event);
    this.getCampaigns($event);
  }

  public getCampaigns(filter ?: string) {
    let page = this.gridState.skip / this.gridState.take + 1;
    let limit = this.gridState.take;
    let sort = this.gridState.sort.length ? this.gridState.sort[0].field : '';
    this._campaignService.getList(page, limit, sort, filter);
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
