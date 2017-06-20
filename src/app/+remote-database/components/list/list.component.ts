import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';

import { RemoteDatabaseService } from '../../remote-database.service';

import {
  RemoteDatabaseFilter,
  RemoteDatabasePost
} from '../../remote-database.model';

import {
  ToastrService
} from 'ngx-toastr';

import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { RemoteDatabaseCreateOrUpdateComponent } from '../create-or-update/create-or-update.component';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/takeUntil';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'remote-database-list',  // <remote-database-list></remote-database-list>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'list.template.html',
  styleUrls: ['list.style.scss']
})
export class RemoteDatabaseListComponent implements OnInit, OnDestroy {
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  public searchText = new FormControl();

  public editDataItem: RemoteDatabasePost;

  public remoteDatabaseFilter: RemoteDatabaseFilter = {
    page: 1,
    limit: 10,
    sort: '',
    search: ''
  };

  public isWaiting: boolean = false;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _remoteDatabaseService: RemoteDatabaseService,
              private _toast: ToastrService,
              private _confirmService: ConfirmService,
              private _dialogService: DialogService) {
  }

  public ngOnInit(): void {
    let self = this;

    // Update view when service subscriber list next value
    self.view = self._remoteDatabaseService
      .map((data: any) => {
        return {
          data: data.data,
          total: data.total
        };
      }).takeUntil(this._ngUnsubscribe);

    self._remoteDatabaseService.getRemoteDatabaseList(this.remoteDatabaseFilter);

    // Change search text
    this.searchText.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((term) => {
        this.remoteDatabaseFilter.page = 1;
        this.gridState.skip = 0;
        this.remoteDatabaseFilter.search = term;
        this._remoteDatabaseService.getRemoteDatabaseList(this.remoteDatabaseFilter);
      });
  }

  // This function happen when user filter, sort, pagination
  public onStateChange(state: State) {
    this.gridState = state;
    if (state.sort.length) {
      this.remoteDatabaseFilter.sort = state.sort[0].field;
      this.gridState.sort = state.sort;
    }

    this.remoteDatabaseFilter.page = (state.skip / this.remoteDatabaseFilter.limit) + 1;
    this.gridState.skip = state.skip;

    this._remoteDatabaseService.getRemoteDatabaseList(this.remoteDatabaseFilter);
  }

  // This function happen when user click create button
  public addHandler() {
    let self = this;

    // new remote database connection model then open dialog
    self.editDataItem = new RemoteDatabasePost();

    const dialog: DialogRef = this._dialogService.open({
      title: `Create Remote Database Connection`,
      content: RemoteDatabaseCreateOrUpdateComponent
    });

    const dialogInstance = dialog.content.instance;
    dialogInstance.modalInstance = dialog;
    dialogInstance.isNew = true;

    dialog.result
      .takeUntil(this._ngUnsubscribe)
      .subscribe((result: any) => {
        if (result.success) {
          // Update grid
          this.onStateChange(this.gridState);
        }
      });
  }

  // This function happen when user click edit button
  public editHandler(dataItem) {
    let self = this;

    if (!this.isWaiting) {
      this.isWaiting = true;

      // Call api for get detail and then open dialog
      self._remoteDatabaseService.getDetail(dataItem._id)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {
          this.isWaiting = false;

          self.editDataItem = new RemoteDatabasePost(data);

          const dialog: DialogRef = this._dialogService.open({
            title: `Edit Connection: ${dataItem.name}`,
            content: RemoteDatabaseCreateOrUpdateComponent
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

  // This function happen when user click delete button
  public removeHandler(dataItem) {

    let message = `Are you sure you want to delete <b>${dataItem.name} connection</b>?`;

    this._confirmService.show(message, (action) => {
      if (action === 'Yes') {
        this._remoteDatabaseService.remove(dataItem._id)
          .takeUntil(this._ngUnsubscribe)
          .subscribe((data) => {
            this._toast.success('Delete remote database successful.', 'Success');

            // Update grid
            this.onStateChange(this.gridState);
          }, (err) => {
            this._toast.error(err.errorMessage, 'Error');
          });
      }
    }, true);
  }

  // This function happen user want to filter
  public filter($event) {
    let self = this;

    this.remoteDatabaseFilter.search = $event;
    self._remoteDatabaseService.getRemoteDatabaseList(this.remoteDatabaseFilter);
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
