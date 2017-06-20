import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit, OnDestroy
} from '@angular/core';

import {
  SubscriberListTypes,
  SubscriberList,
  SubscriberListTypeEnum,
  SubscriberListPagePost,
} from '../../subscriber-lists.model';

import {
  FormControl,
  Validators
} from '@angular/forms';
import { SubscriberListsService } from '../../subscriber-lists.service';
import {
  ExtraValidators,
  ValidationService
} from '../../../shared/services/validation/validation.service';
import { AppConstant } from '../../../app.constant';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { UserContext } from '../../../shared/index';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'subscriber-list-create-or-update',  // <subscriber-list></subscriber-list>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'create-or-update.template.html',
  providers: [ValidationService]
})
export class SubscriberListCreateOrUpdateComponent implements OnInit, OnDestroy {
  @Input() public isNew: boolean = false;

  @Input() modalInstance: any;

  public formErrors = {
    name: '',
    type: '',
    description: '',
  };

  public validationMessages = {
    name: {
      required: 'Name is required.',
      minlength: 'Name field is a at least 3 characters long and no greater than 255 characters',
      maxlength: 'Name field is a at least 3 characters long and no greater than 255 characters'
    },
    description: {
      required: 'Description is required.'
    }
  };

  public controlConfig = {
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    type: new FormControl({value: ''}),
    data_source_id: new FormControl({value: ''}, [
      Validators.compose([
        ExtraValidators.conditional(
          (group) => group.get('type').value === SubscriberListTypeEnum.REMOTE,
          Validators.compose([
            Validators.required,
          ])
        ),
      ])
    ]),
    description: new FormControl('', Validators.required)
  };

  public remoteDB = [];

  public frm: any;

  public active: boolean = false;

  public title: string = 'Create List';

  public subscriberListTypes = SubscriberListTypes;

  public submitted: boolean = false;

  private _subscriberListModel: SubscriberList;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input()
  public set model(subscriberList: any) {
    let self = this;

    self.title = self.isNew ? 'Create List' :
      `Edit: ${subscriberList.name}`;

    self._subscriberListModel = subscriberList;
  }

  public get model() {
    return this._subscriberListModel;
  }

  constructor(private _subscriberListsService: SubscriberListsService,
              private _validationService: ValidationService,
              private _toast: ToastrService,
              private _userContext: UserContext) {

  }

  public ngOnInit(): void {
    let self = this;

    // Build form
    self.frm = self._validationService.buildForm(self.controlConfig,
      self.formErrors, self.validationMessages);

    // Call reset form to bind model to form
    if (self.model) {
      self.frm.reset(self.model);
    }

    self._subscriberListsService.getSource()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data) => {
        self.remoteDB = data;
      });
  }

  // Save function
  public onSave(value): void {
    this.submitted = true;
    let accountId = this._userContext.currentUser.account_id || AppConstant.accountId;
    let obj = {
      _id: this.model._id,
      name: value.name,
      description: value.description,
      remote: value.type === SubscriberListTypeEnum.REMOTE,
      data_source_id: value.data_source_id,
      account_id: accountId
    };
    let subscriberList = new SubscriberListPagePost(obj);

    // If new then call api update else call api update
    if (this.isNew) {
      this._subscriberListsService.create(subscriberList)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          this._toast.success('Create subscriber list successful.', 'Success');

          this.modalInstance.close({success: true});
          this.submitted = false;

        }, (err) => {
          this._toast.error(err.errorMessage, 'Error');
          this.submitted = false;
        });
    } else {
      this._subscriberListsService.update(subscriberList)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          this._toast.success('Update subscriber list successful.', 'Success');

          this.modalInstance.close({success: true});
          this.submitted = false;
        }, (err) => {
          this._toast.error(err.errorMessage, 'Error');
          this.submitted = false;
        });
    }
  }

  // Cancel function
  public onCancel(e): void {
    e.preventDefault();

    this.modalInstance.close();
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
