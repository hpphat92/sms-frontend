import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { UserService } from '../../users.service';

import {
  UserModel,
  UserFilter
} from '../../users.model';

import {
  DialogRef,
  DialogService
} from '@progress/kendo-angular-dialog';

import {
  ToastrService
} from 'ngx-toastr';

import { UserCreateOrUpdateComponent } from '../create-or-update/create-or-update.component';
import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/takeUntil';

@Component({
  selector: 'user-list',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'user-list.template.html',
  styleUrls: ['user-list.style.scss']
})
export class UserListComponent implements OnInit, OnDestroy {
  public view: Observable<GridDataResult>;

  public userFilter: UserFilter = {
    page: 1,
    limit: 10,
    sort: '',
    search: ''
  };

  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  // searching keywords
  public searchText = new FormControl();

  // edit item
  public editDataItem: UserModel;

  public isWaiting: boolean = false;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _userService: UserService,
              private _dialogService: DialogService,
              private _toast: ToastrService,
              private _confirmService: ConfirmService) {
  }

  public ngOnInit(): void {
    this.view = this._userService
      .map((data: any) => {
        return {
          data: data.data,
          total: data.total
        };
      })
      .takeUntil(this._ngUnsubscribe);

    // Get list data when component init
    this._userService.getList(this.userFilter);

    // Change search text
    this.searchText.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((term) => {
        this.userFilter.page = 1;
        this.gridState.skip = 0;
        this.userFilter.search = term;
        this._userService.getList(this.userFilter);
      });
  }

  public onStateChange(state: State) {
    this.gridState = state;
    if (state.sort.length) {
      this.userFilter.sort = state.sort[0].field;
      this.gridState.sort = state.sort;
    }

    this.userFilter.page = (state.skip / this.userFilter.limit) + 1;
    this.gridState.skip = state.skip;

    this._userService.getList(this.userFilter);
  }

  /**
   * Add button callback
   * @param event
   */
  public addHandler(event) {
    // create edit item model
    this.editDataItem = new UserModel();

    // create edit item model
    const dialog: DialogRef = this._dialogService.open({
      title: `Create User`,
      content: UserCreateOrUpdateComponent
    });

    const dialogInstance = dialog.content.instance;
    dialogInstance.modalInstance = dialog;
    dialogInstance.model = this.editDataItem;
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

  /**
   * Edit button callback
   * @param dataItem
   */
  public editHandler(dataItem) {
    // Get details of user

    if (!this.isWaiting) {
      this.isWaiting = true;
      this._userService.getById(dataItem._id)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {
          this.isWaiting = false;
          this.editDataItem = new UserModel(data);

          // Bind remote data to model
          this.editDataItem.password = ''; // hide password
          this.editDataItem.confirm = ''; // hide confirm

          // create edit item model
          const dialog: DialogRef = this._dialogService.open({
            title: `Edit: ${ this.editDataItem.firstName} ${ this.editDataItem.lastName}`,
            content: UserCreateOrUpdateComponent
          });

          const dialogInstance = dialog.content.instance;
          dialogInstance.modalInstance = dialog;
          dialogInstance.model = this.editDataItem;

          dialog.result
            .takeUntil(this._ngUnsubscribe)
            .subscribe((result: any) => {
              if (result.success) {
                // Update grid
                this.onStateChange(this.gridState);
              }
            });
        }, (err) => {
          this.isWaiting = false;
          this._toast.error(err.errorMessage, 'Error');
        });
    }

  }

  /**
   * Remove button callback
   * @param dataItem
   */
  public removeHandler(dataItem) {

    let message = `Are you sure you want to delete <b>${dataItem.firstName} ${dataItem.lastName}</b>?`;

    this._confirmService.show(message, (action) => {
      if (action === 'Yes') {
        this._userService.remove(dataItem._id)
          .takeUntil(this._ngUnsubscribe)
          .subscribe((data) => {
            this._toast.success('Delete user successful.', 'Success');

            // Update grid
            this.onStateChange(this.gridState);
          }, (err) => {
            this._toast.error(err.errorMessage, 'Error');
          });
      }
    }, true);

  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
