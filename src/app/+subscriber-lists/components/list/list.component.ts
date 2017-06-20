import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  DialogRef,
  DialogService
} from '@progress/kendo-angular-dialog';

import { SubscriberListsService } from '../../subscriber-lists.service';

import {
  SubscriberList,
  SubscriberListTypes,
  SubscriberListFilter
} from '../../subscriber-lists.model';

import {
  ToastrService
} from 'ngx-toastr';

import {
  SubscriberListCreateOrUpdateComponent
} from '../create-or-update/create-or-update.component';
import { CreateSubscriberComponent } from '../create-subscriber/create-subscriber.component';
import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/takeUntil';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'subscriber-lists-list',  // <subscriber-list></subscriber-list>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'list.template.html',
  styleUrls: ['list.style.scss']
})
export class SubscriberListsListComponent implements OnInit, OnDestroy {
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  public searchText = new FormControl();

  public editDataItem: SubscriberList;

  public subscriberListTypes = SubscriberListTypes;

  public subscriberListFilter: SubscriberListFilter = {
    page: 1,
    limit: 10,
    sort: '',
    search: ''
  };
  public subscriberListDetail: any;

  public isWaiting: boolean = false;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _subscriberListsService: SubscriberListsService,
              private _dialogService: DialogService,
              private _toast: ToastrService,
              private _confirmService: ConfirmService) {
  }

  public ngOnInit(): void {
    let self = this;

    // Update view when service subscriber list next value
    self.view = self._subscriberListsService
      .map((data: any) => {
        return {
          data: data.data,
          total: data.total
        };
      })
      .takeUntil(this._ngUnsubscribe);

    self._subscriberListsService.getSubscriberList(this.subscriberListFilter);

    // Change search text
    this.searchText.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((term) => {

        this.subscriberListFilter.page = 1;
        this.gridState.skip = 0;
        this.subscriberListFilter.search = term;
        self._subscriberListsService.getSubscriberList(this.subscriberListFilter);
      });
  }

  // This function happen when user filter, sort, pagination
  public onStateChange(state: State) {
    this.gridState = state;
    if (state.sort.length) {
      this.subscriberListFilter.sort = state.sort[0].field;
      this.gridState.sort = state.sort;
    }

    this.subscriberListFilter.page = (state.skip / this.subscriberListFilter.limit) + 1;
    this.gridState.skip = state.skip;

    this._subscriberListsService.getSubscriberList(this.subscriberListFilter);
  }

  // This function happen when user click create button
  public addHandler() {
    let self = this;

    // new subscriber list model then open dialog
    self.editDataItem = new SubscriberList();

    const dialog: DialogRef = self._dialogService.open({
      title: `Create Lists`,
      content: SubscriberListCreateOrUpdateComponent
    });

    const dialogInstance = dialog.content.instance;
    dialogInstance.modalInstance = dialog;
    dialogInstance.model = self.editDataItem;
    dialogInstance.isNew = true;

    dialog.result
      .takeUntil(this._ngUnsubscribe)
      .subscribe((result: any) => {
        if (result.success) {
          self.onStateChange(self.gridState);
        }
      });
  }

  // This function happen when user click edit button
  public editHandler(dataItem) {
    let self = this;

    if (!this.isWaiting) {
      this.isWaiting = true;

      // Call api for get detail and then open dialog
      self._subscriberListsService.getDetail(dataItem._id)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          this.isWaiting = false;

          self.editDataItem = new SubscriberList(data);

          const dialog: DialogRef = self._dialogService.open({
            title: `Edit ` + dataItem.name,
            content: SubscriberListCreateOrUpdateComponent
          });

          const dialogInstance = dialog.content.instance;
          dialogInstance.modalInstance = dialog;
          dialogInstance.model = self.editDataItem;
          dialogInstance.isNew = false;

          dialog.result
            .takeUntil(this._ngUnsubscribe)
            .subscribe((result: any) => {
              if (result.success) {
                self.onStateChange(self.gridState);
              }

            });
        });
    }

  }

  // This function happen when user click delete button
  public removeHandler(dataItem) {

    let message = `Are you sure you want to delete <b>${dataItem.name}</b>?`;

    this._confirmService.show(message, (action) => {
      if (action === 'Yes') {
        this._subscriberListsService
          .remove(dataItem._id)
          .takeUntil(this._ngUnsubscribe)
          .subscribe((data) => {
            this._toast.success('Delete subscriber list successful.', 'Success');

            // Update grid
            this.onStateChange(this.gridState);
          }, (err) => {
            this._toast.error(err.errorMessage, 'Error');
          });
      }
    }, true);
  }

  // This function happen user click add sub button
  public addSubscriber(dataItem) {
    let self = this;
    self._subscriberListsService.getDetail(dataItem._id)
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data) => {
        self.subscriberListDetail = data;

        const dialog: DialogRef = self._dialogService.open({
          title: `List: ${data.name} - Add subscriber`,
          content: CreateSubscriberComponent
        });

        const dialogInstance = dialog.content.instance;
        dialogInstance.modalInstance = dialog;
        dialogInstance.subscriberListDetail = data;

        dialog.result
          .takeUntil(this._ngUnsubscribe)
          .subscribe((result: any) => {
            if (result.success) {
              // Update grid
              self.onStateChange(self.gridState);
            }
          });
      });
  }

  // This function happen user view subscriber
  public viewSubscriber($event) {
    alert('Coming soon!');
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
