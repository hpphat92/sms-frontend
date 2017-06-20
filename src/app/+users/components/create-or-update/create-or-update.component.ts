import {
  Component, Input,
  ViewEncapsulation,
  OnInit, OnDestroy
} from '@angular/core';

import {
  FormControl,
  Validators
} from '@angular/forms';

import { ValidationService } from '../../../shared/services/validation/validation.service';

import {
  UserModel,
  RoleList
} from '../../users.model';

import { Matcher } from '../../../shared/validators/matcher.validator';
import { Http } from '@angular/http';

import { ValidImageValidator } from '../../../shared/validators/valid-image.validator';
import { UserContext } from '../../../shared/services/user-context/user-context';
import { UserService } from '../../users.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs/Subject';
import { AppConstant } from "../../../app.constant";

@Component({
  selector: 'user-create-or-update',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'create-or-update.template.html',
  providers: [ValidationService]
})
export class UserCreateOrUpdateComponent implements OnInit, OnDestroy {
  @Input() public isNew: boolean = false;
  @Input()
  public modalInstance: any;

  public formErrors = {
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: '',
    email: '',
    password: '',
    confirm: '',
    photoUrl: ''
  };

  public validationMessages = {
    firstName: {
      required: 'First name is required.'
    },
    lastName: {
      required: 'Last name is required.'
    },
    phoneNumber: {
      required: 'Phone number is required.',
      // pattern: 'Mobile Number is a valid US mobile number'
    },
    role: {
      required: 'Role is required.'
    },
    email: {
      required: 'Email is required.',
      email: 'Email is a valid formatted email address.'
    },
    password: {
      required: 'Password is required.',
      minlength: 'Password must be 8 characters or greater',
      pattern: 'Password must contain at least 1 Capital letter and at least 1 Number'
    },
    confirm: {
      nomatch: 'Password and Confirm Password fields match.'
    },
    photoUrl: {
      imageInvalid: 'Photo url is invalid.'
    }
  };

  public controlConfig = {
    firstName: new FormControl('', [
      Validators.required
    ]),
    lastName: new FormControl('', [
      Validators.required
    ]),
    phoneNumber: new FormControl('', [
      Validators.required,
      // Validators.pattern('^(\\([0-9]{3}\\)|[0-9]{3}-)[0-9]{3}-[0-9]{4}$')
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.minLength(8)
    ]),
    confirm: new FormControl('', [
      Matcher('password')
    ]),
    role: new FormControl('', Validators.required),
    timezone: new FormControl(''),
    photoUrl: new FormControl('', null, [
      ValidImageValidator()
    ]),
  };

  public frm: any;
  public title: string = 'Create User';

  public roleList = RoleList;

  public timezoneList = [];

  public mask = ['1', '-', /[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public submitted: boolean = false;

  private _userModel: UserModel;

  @Input()
  public set model(userModel: any) {
    let self = this;

    self.title = self.isNew ? 'Create User' :
      `Edit: ${userModel.firstName} ${userModel.lastName}`;

    self._userModel = userModel;
  }

  public get model() {
    return this._userModel;
  }

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _validationService: ValidationService,
              private _http: Http,
              private _userContext: UserContext,
              private _userService: UserService,
              private _toast: ToastrService) {

  }

  public ngOnInit(): void {
    let self = this;

    // Update validator for create new or update status
    this.controlConfig.password = self.isNew ? new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(`^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\+~!@#$%^&*()-_=\\[\\]{};':"\\<>,\\.\\/\\?|]+$`)
    ]) : new FormControl('', [
      Validators.minLength(8),
      Validators.pattern(`^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\+~!@#$%^&*()-_=\\[\\]{};':"\\<>,\\.\\/\\?|]+$`)
    ]);

    self.frm = self._validationService.buildForm(self.controlConfig,
      self.formErrors, self.validationMessages);

    this._http.request('assets/json/timezones.json')
      .map((data) => data.json())
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data: any) => {

        this.timezoneList = data;

        if (this.isNew) {
          // Bind default timezone based on browser info
          // let offset = _.filter(data, (tz: any) => {
          //   return new RegExp(`^\\(${this._getTimeZone()
          //     .replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&')}\\)`).test(tz.text);
          // })[0];
          // if (offset) {
          //   this.model.timezone = offset.text;
          // }

          this.model.timezone = '(UTC-05:00) Eastern Time (US & Canada)';
        }

        this.frm.reset(this.model);
      });

    // If user has role manager then remove admin role from role lsit
    if (this._userContext.currentUser.role !== RoleList[0]) { // Admin
      this.roleList = RoleList.filter((obj) => obj !== RoleList[0]);
    }
  }

  /**
   * Save button callback
   * @param value
   */
  public onSave(value): void {
    this.submitted = true;

    let obj: any = {
      _id: this.model ? this.model._id : null,
      email: value.email,
      role: value.role,
      firstName: value.firstName,
      lastName: value.lastName,
      photoUrl: value.photoUrl,
      timezone: value.timezone,
      phoneNumber: value.phoneNumber,
      account_id: this._userContext.currentUser.account_id || AppConstant.accountId
    };

    if (value.password) {
      obj.password = value.password;
    }

    let user = new UserModel(obj);

    if (this.isNew) {
      // if it's creating
      // then call create method
      this._userService
        .create(user)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {
          this.submitted = false;

          // Toast message
          this._toast.success('Create User Successful.', 'Success');

          this.onCancel({success: true});

        }, (err) => {
          this.submitted = false;
          this._toast.error(err.errorMessage, 'Error');
        });
    } else {
      // otherwise, call update method
      this._userService
        .update(user)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {
          this.submitted = false;

          // Toast message
          this._toast.success('Update User Successful.', 'Success');

          this.onCancel({success: true});

        }, (err) => {
          this.submitted = false;
          this._toast.error(err.errorMessage, 'Error');
        });

    }
  }

  /**
   * Cancel button callback
   * @param e
   */
  public onCancel(e?: any): void {
    this.modalInstance.close(e);
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  /**
   * Get Time zone
   * @returns {string}
   * @private
   */
  private _getTimeZone() {
    let offset = new Date().getTimezoneOffset();
    let o = Math.abs(offset);
    return 'UTC' + (offset < 0 ? '+' : '-') +
      ('0' + Math.floor(o / 60)).slice(-2) + ':' + ('0' + (o % 60)).slice(-2);
  }

}
