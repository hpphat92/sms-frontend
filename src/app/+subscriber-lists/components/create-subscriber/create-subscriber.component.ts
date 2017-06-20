import {
  Component, Input,
  ViewEncapsulation, OnInit, OnDestroy
} from '@angular/core';

import {
  FormControl,
  Validators
} from '@angular/forms';

import {
  Http
} from '@angular/http';

import {
  ToastrService
} from 'ngx-toastr';

import { ValidationService } from '../../../shared/services/validation/validation.service';
import { SubscriberService } from './subscriber.service';
import { Subscriber } from './subscriber.model';
import * as _ from 'lodash';
import { Subject } from 'rxjs/Subject';
import { AppConstant } from '../../../app.constant';
import { UserContext } from '../../../shared/index';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'create-subscriber',  // <create-subscriber></create-subscriber>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'create-subscriber.template.html',
  styleUrls: ['subscriber-create.scss'],
  providers: [ValidationService]
})
export class CreateSubscriberComponent implements OnInit, OnDestroy {
  @Input() public subscriberListDetail: any;
  @Input()
  public modalInstance: any;

  public _subscriber: Subscriber;
  public timezoneList = [];
  public countryList = [];
  public newControlNames = [];
  public statusList = [
    {text: 'Active', value: 'active'},
    {text: 'Unsubscribed', value: 'unsubscribed'},
    {text: 'Spam complaint', value: 'complained'},
    {text: 'Unsubscribed', value: 'unsubscribed'},
    {text: 'Undeliverable', value: 'undeliverable'},
    {text: 'Deactivated', value: 'deactivated'}
  ];
  public languageList = [];
  public formErrors = {
    mobile: '',
    email: '',
    postal: ''
  };
  public mask = ['1', '-', /[1-9]/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
  public validationMessages = {
    mobile: {
      required: 'Mobile No. is required.'
    },
    email: {
      pattern: 'Email  is a not valid formatted email address.'
    },
    postal: {
      pattern: 'Postal code must be number'
    }
  };
  public controlConfig = {
    mobile: new FormControl('', [
      Validators.required
    ]),
    status: new FormControl('', []),
    postal: new FormControl('', [
      Validators.pattern('^[0-9]+$')
    ]),
    email: new FormControl('', [
      // Validators.email
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,7}$')
    ]),
    voice: new FormControl('', []),
    address1: new FormControl('', []),
    address2: new FormControl('', []),
    state: new FormControl('', []),
    language: new FormControl('', []),
    timezone: new FormControl('', []),
    name: new FormControl('', []),
    city: new FormControl('', []),
    country: new FormControl('', [])
  };
  public frm: any;

  public submitted: boolean = false;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _validationService: ValidationService,
              private _subscriberService: SubscriberService,
              private _toast: ToastrService,
              private _http: Http,
              private _userContext: UserContext) {

    this._subscriber = new Subscriber();
  }

  public ngOnInit() {
    this._subscriber = new Subscriber(this.subscriberListDetail.data);
    // load country data
    this._http.request('assets/json/countries.json')
      .map((data) => data.json())
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data: any) => {
        this.countryList = data;
      });

    // load timezone data
    this._http.request('assets/json/timezones.json')
      .map((data) => data.json())
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data: any) => {
        this.timezoneList = data;
      });

    // load language data
    this._http.request('assets/json/languages.json')
      .map((data) => data.json())
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data: any) => {
        this.languageList = data;
      });
    // set default value
    if (this._subscriber) {
      if (!this._subscriber.country) {
        this._subscriber.country = 'United States';
      }
      if (!this._subscriber.timezone) {
        this._subscriber.timezone = '(UTC-05:00) Eastern Time (US & Canada)';
      }
      if (!this._subscriber.language) {
        this._subscriber.language = 'English';
      }
      if (!this._subscriber.status) {
        this._subscriber.status = 'active';
      }
      // remove value if value is string or number
      _.forOwn(this._subscriber, (value, key) => {
        if (this._subscriber[key] === 'string' || this._subscriber[key] === 'number') {
          this._subscriber[key] = '';
        }
      });
    }
    // create new form control by comparing

    if (this.subscriberListDetail.data) {
      let existingField = Object.keys(this._subscriber);
      let filedsInSubscriberListDetail = Object.keys(this.subscriberListDetail.data);
      this.newControlNames = filedsInSubscriberListDetail.filter(
        (o) => existingField.indexOf(o) === -1);

      if (this.newControlNames.length) {
        _.each(this.newControlNames, (name) => {
          this.controlConfig[name] = new FormControl('', []);
        });
      }
    }

    this.frm = this._validationService.buildForm(this.controlConfig,
      this.formErrors, this.validationMessages);
    this.frm.reset(this._subscriber);
    // init value for new control
    if (this.newControlNames.length) {
      _.each(this.newControlNames, (name) => {
        this.frm.controls[name].setValue(name);
      });
    }
  }

  public onSave(formValue) {
    this.submitted = true;
    let accountId = this._userContext.currentUser.account_id || AppConstant.accountId;

    let obj = {
      data: {},
      mobile: '',
      status: '',
      account_id: '',
      list_id: '',
    };

    obj.mobile = formValue.mobile;
    obj.status = formValue.status;
    obj.account_id = accountId;
    obj.list_id = this.subscriberListDetail._id;
    // convert data before post
    let tmp = Object.keys(formValue);
    obj.data = _.pick(formValue, tmp.filter((t) => ['mobile', 'status'].indexOf(t) === -1));
    // post data
    this._subscriberService.create(obj)
      .takeUntil(this._ngUnsubscribe)
      .subscribe((d) => {

        this.submitted = false;

        this._toast.success('Create subscriber list successful.', 'Success');

        this.modalInstance.close({success: true});
      }, (err) => {
        this.submitted = false;

        this._toast.error(err.errorMessage, 'Error');
      });
  }

  // Cancel function
  public onCancel(e?: any): void {
    this.modalInstance.close();
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
