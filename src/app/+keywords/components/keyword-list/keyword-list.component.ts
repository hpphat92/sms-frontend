import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';

import {
  State,
} from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { KeywordService } from '../../keywords.service';

import {
  DialogRef,
  DialogService
} from '@progress/kendo-angular-dialog';

import {
  ToastrService
} from 'ngx-toastr';

import * as _ from 'lodash';

import {
  ReserveKeywordFormComponent
} from '../reserve-keyword-form/reserve-keyword-form.component';

import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';
import { FormControl } from '@angular/forms';
import { Subject } from 'rxjs/Subject';

import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'keyword-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'keyword-list.template.html',
  styleUrls: ['keyword-list.style.scss']
})
export class KeywordListComponent implements OnInit, OnDestroy {

  // Kendo grid configuration
  public view: Observable<GridDataResult>;

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  // searching keywords
  public searchText = new FormControl();

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _keywordService: KeywordService,
              private _dialogService: DialogService,
              private _toast: ToastrService,
              private _confirmService: ConfirmService) {
  }

  public ngOnInit(): void {
    // datasource for kendo-grid
    // call next() inside service to push data to data source
    this.view = this._keywordService
      .map((data: any) => {

        _.each(data.data, (obj, idx) => {
          if (obj.codes && obj.codes.length) {
            obj.status = obj.codes[0].remove ? 'Pending Removal' :
              obj.codes[0].program_id ? 'Reserved' : 'Released';
          } else {
            obj.status = 'Released';
          }
        });

        return {
          data: data.data,
          total: data.total
        };
      })
      .takeUntil(this._ngUnsubscribe);

    // Get list data when component init
    // this._keywordService.getList();
    this.getKeywords();

    // Change search text
    this.searchText.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((term) => {
        this.gridState.skip = 0;
        this.getKeywords(term);
      });
  }

  public onStateChange(state: State) {
    this.gridState = state;

    this.getKeywords();
  }

  /**
   * Add button callback
   * @param event
   */
  public addHandler() {
    // create edit item model
    const dialog: DialogRef = this._dialogService.open({
      title: `Reserve Keyword`,
      content: ReserveKeywordFormComponent
    });

    const dialogInstance = dialog.content.instance;
    dialogInstance.modalInstance = dialog;

    dialog.result.subscribe((result: any) => {
      if (result.success) {
        // Update grid
        this.onStateChange(this.gridState);
      }
    });
  }

  /**
   * Release button callback
   * @param data
   */
  public releaseKeyword(data) {

    let message = `Are you sure you want to release the ${data._id} keyword?`;

    this._confirmService.show(message, (action) => {
      if (action === 'Yes') {
        this._keywordService.release(data)
          .takeUntil(this._ngUnsubscribe)
          .subscribe(() => {
            this._toast.success('Release keyword successful.', 'Success');
            // Refresh the grid
            this.onStateChange(this.gridState);
          });
      }
    });
  }

  public getKeywords(filter?: string) {
    let page = 1;
    page = this.gridState.skip / this.gridState.take + 1;
    let limit = this.gridState.take;
    let sort = this.gridState.sort.length ? this.gridState.sort[0].field : '';

    this._keywordService.getList(page, limit, sort, filter);
  }

  /**
   * Remove keyword
   * @param data
   */
  public removeKeyword(data) {

    let message = `Are you sure you want to remove the ${data._id} keyword?`;

    this._confirmService.show(message, (action) => {
      if (action === 'Yes') {
        this._keywordService.remove(data)
          .takeUntil(this._ngUnsubscribe)
          .subscribe(() => {
            this._toast.success('Remove Keyword Successful.' +
              ' The keyword will be removed from your account ' +
              'within 30 days to support existing campaigns.', 'Success');
            // Refresh the grid
            this.onStateChange(this.gridState);
          });
      }
    }, true);
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
