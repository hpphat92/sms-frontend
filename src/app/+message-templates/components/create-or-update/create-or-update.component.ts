import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from '@angular/core';

import {
  FormControl,
  Validators
} from '@angular/forms';

import { ValidationService } from '../../../shared/services/validation/validation.service';

import { MessageTemplate } from '../../message-templates.model';
import { AppConstant } from '../../../app.constant';
import { MessageTemplateService } from '../../message-templates.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { UserContext } from '../../../shared/index';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  // <message-templates-create-or-update></message-templates-create-or-update>
  selector: 'message-templates-create-or-update',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'create-or-update.template.html',
  providers: [ValidationService]
})
export class MessageTemplatesCreateOrUpdateComponent implements OnInit, OnDestroy {
  @Input()
  public isNew: boolean = false;

  @Input()
  public modalInstance: any;

  public formErrors = {
    name: '',
    content: '',
  };

  public validationMessages = {
    name: {
      required: 'Name is required.',
      minlength: 'Name field is a at least 3 characters long and no greater than 255 characters',
      maxlength: 'Name field is a at least 3 characters long and no greater than 255 characters'
    },
    content: {
      required: 'Content is required.'
    }
  };

  public contentLength: number = 160;

  public controlConfig = {
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    content: new FormControl('', Validators.required),

    substitutionVariables: new FormControl({value: 'First Name', disabled: true})
  };

  public frm: any;

  public active: boolean = false;

  public substitutionVariables: string[] =
    ['First Name', 'Last Name', 'Full Name', 'Mobile Number', 'E-mail', 'Account Number'];

  public submitted: boolean = false;

  private _messageTemplateModel: MessageTemplate;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  @Input()
  public set model(messageTemplate: any) {
    let self = this;

    self._messageTemplateModel = messageTemplate;
  }

  public get model() {
    return this._messageTemplateModel;
  }

  constructor(private _validationService: ValidationService,
              private _messageTemplateService: MessageTemplateService,
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
  }

  // Save function
  public onSave(value): void {
    let accountId = this._userContext.currentUser.account_id || AppConstant.accountId;

    this.submitted = true;
    let obj = {
      _id: this.model ? this.model._id : null,
      name: value.name,
      content: value.content,
      account_id: accountId
    };
    let messageTemplate = new MessageTemplate(obj);

    // If new then call api update else call api update
    if (this.isNew) {
      this._messageTemplateService
        .create(messageTemplate)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          this._toast.success('Create message template successful.', 'Success');

          this.submitted = false;

          this.onCancel({success: true});

        }, (err) => {
          this.submitted = false;
          this._toast.error('Error', err.errorMessage);
        });
    } else {
      this._messageTemplateService
        .update(messageTemplate)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          this._toast.success('Update message template successful.', 'Success');

          this.submitted = false;

          this.onCancel({success: true});

        }, (err) => {
          this.submitted = false;
          this._toast.error('Error', err.errorMessage);
        });
    }
  }

  // Cancel function
  public onCancel(e?: any): void {
    this.modalInstance.close(e);
  }

  public contentPage(): number {
    let content = this.frm.get('content').value;
    return Math.ceil(content.length / this.contentLength) || 1;
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
