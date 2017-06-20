import {
  Component, OnDestroy,
  OnInit,
  ViewEncapsulation
} from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { State } from '@progress/kendo-data-query';
import { GridDataResult } from '@progress/kendo-angular-grid';
import {
  DialogRef,
  DialogService
} from '@progress/kendo-angular-dialog';

import {
  ToastrService
} from 'ngx-toastr';

import { MessageTemplate, MessageTemplateFilter } from '../../message-templates.model';

import { MessageTemplateService } from '../../message-templates.service';

import { MessageTemplatesCreateOrUpdateComponent } from '../create-or-update/create-or-update.component';
import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';
import { Subject } from 'rxjs/Subject';
import { FormControl } from '@angular/forms';

import 'rxjs/add/operator/takeUntil';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'message-templates-list',  // <message-templates-list></message-templates-list>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'list.template.html',
  styleUrls: ['list.style.scss']
})
export class MessageTemplatesListComponent implements OnInit, OnDestroy {
  public view: Observable<GridDataResult>;
  public gridState: State = {
    sort: [],
    skip: 0,
    take: 10
  };

  public searchText = new FormControl();
  public isNew: boolean = false;
  public opened: boolean = false;

  public editDataItem: MessageTemplate;

  public messageTemplateFilter: MessageTemplateFilter = {
    page: 1,
    limit: 10,
    sort: '',
    search: ''
  };

  public isWaiting: boolean = false;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _messageTemplateService: MessageTemplateService,
              private _dialogService: DialogService,
              private _toast: ToastrService,
              private _confirmService: ConfirmService) {
  }

  public ngOnInit(): void {
    let self = this;

    // Update view when service subscriber list next value
    self.view = self._messageTemplateService
      .map((data: any) => {
        return {
          data: data.data,
          total: data.total
        };
      })
      .takeUntil(this._ngUnsubscribe);

    self._messageTemplateService.getList(this.messageTemplateFilter);

    // Change search text
    this.searchText.valueChanges
      .debounceTime(400)
      .distinctUntilChanged()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((term) => {
        this.messageTemplateFilter.page = 1;
        this.gridState.skip = 0;
        this.messageTemplateFilter.search = term;
        self._messageTemplateService.getList(this.messageTemplateFilter);
      });
  }

  // This function happen when user filter, sort, pagination
  public onStateChange(state: State) {
    this.gridState = state;
    if (state.sort.length) {
      this.messageTemplateFilter.sort = state.sort[0].field;
      this.gridState.sort = state.sort;
    }

    this.messageTemplateFilter.page = (state.skip / this.messageTemplateFilter.limit) + 1;
    this.gridState.skip = state.skip;

    this._messageTemplateService.getList(this.messageTemplateFilter);
  }

  // This function happen when user click create button
  public addHandler() {
    let self = this;

    // new subscriber list model then open dialog
    self.editDataItem = new MessageTemplate();

    // create edit item model
    const dialog: DialogRef = this._dialogService.open({
      title: 'Create Message Template',
      content: MessageTemplatesCreateOrUpdateComponent
    });

    const dialogInstance = dialog.content.instance;
    dialogInstance.modalInstance = dialog;
    dialogInstance.model = self.editDataItem;
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
      self._messageTemplateService.getDetail(dataItem._id)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          this.isWaiting = false;

          self.editDataItem = new MessageTemplate(data);

          // create edit item model
          const dialog: DialogRef = this._dialogService.open({
            title: `Edit: ${data.name}`,
            content: MessageTemplatesCreateOrUpdateComponent
          });

          const dialogInstance = dialog.content.instance;
          dialogInstance.modalInstance = dialog;
          dialogInstance.model = self.editDataItem;

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

    let message = `Are you sure you want to delete <b>${dataItem.name}</b>?`;

    this._confirmService.show(message, (action) => {
      if (action === 'Yes') {
        this._messageTemplateService
          .remove(dataItem._id)
          .takeUntil(this._ngUnsubscribe)
          .subscribe((data) => {
            this._toast.success('Delete message template successful.', 'Success');

            // Update grid
            this.onStateChange(this.gridState);
          }, (err) => {
            this._toast.error(err.errorMessage, 'Error');
          });
      }
    }, true);
  }

  public ngOnDestroy(): void {
    // Complete ngUnsunbscribe to
    // guarantee all subscriptions will be cleaned up when the component is destroyed.
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
