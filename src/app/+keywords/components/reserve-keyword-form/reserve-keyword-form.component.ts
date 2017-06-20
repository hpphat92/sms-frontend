import {
  Component,
  Input,
  ViewEncapsulation,
  OnInit, OnDestroy
} from '@angular/core';

import {
  FormControl,
  Validators
} from '@angular/forms';
import { KeywordService } from '../../keywords.service';
import { ValidationService } from '../../../shared/services/validation/validation.service';
import { Matcher } from '../../../shared/validators/matcher.validator';
import { KeywordAvailableValidator } from '../../keywords-avalable.validator';
import { ExcludeValidator } from '../../keywords-exclude.validator';
import { ReserveKeywordModel } from '../../keywords.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'reserve-keyword-form',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'reserve-keyword-form.template.html',
  providers: [ValidationService]
})
export class ReserveKeywordFormComponent implements OnInit, OnDestroy {

  @Input()
  public modalInstance: any;

  public formErrors = {
    shortcode: '',
    keyword: '',
    confirm: '',
  };

  public validationMessages = {
    shortcode: {
      required: 'Short code is required.',
    },
    keyword: {
      required: 'Keyword is required.',
      minlength: 'Keyword field contents must be at least 3 characters long.',
      maxlength: 'Keyword field contents must be no greater than 15 characters long.',
      pattern: 'Keyword field must not contain any spaces or special characters',
      notAvailable: 'Keyword is not available.',
      invalidExclude: 'Keyword field cannot be a reserved word ' +
      '- STOP, STOPALL, HELP, UNSUBSCRIBE, YES, NO or CANCEL.',
    },
    confirm: {
      required: 'Confirm is required.',
      nomatch: 'Keyword and Confirm fields must match.'
    }
  };

  public controlConfig = {
    shortcode: new FormControl('', [
      Validators.required,
    ]),
    keyword: new FormControl('',
      [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(15),
        Validators.pattern('[a-zA-Z0-9]+$'),
        ExcludeValidator()
      ],
      [
        new KeywordAvailableValidator(this._keywordService)
          .validate.bind(this)
      ]
    ),
    confirm: new FormControl('', [
      Validators.required,
      Matcher('keyword')
    ])
  };

  public frm: any;
  public title: string = 'Reserve Keyword';

  @Input()
  public set model(campaignModel: any) {
    if (this.frm) {
      this.frm.reset(campaignModel);
    }
  }

  public shortcodes: any[] = [];

  public submitted: boolean = false;

  public formChangeSubscription: any;
  public codeSubscription: any;
  public reserveSubscription: any;

  constructor(private _keywordService: KeywordService,
              private _validationService: ValidationService,
              private _toast: ToastrService) {

  }

  public ngOnInit(): void {

    this.frm = this._validationService.buildForm(this.controlConfig,
      this.formErrors, this.validationMessages);

    // Watch change of keyword to update validity for confirm
    this.formChangeSubscription = this.frm.controls['keyword'].valueChanges.subscribe((data) => {
      this.frm.controls['confirm'].updateValueAndValidity();
    });

    this.codeSubscription = this._keywordService.getCodes().subscribe((res) => {
      this.shortcodes = res;
    });
  }

  /**
   * Save button callback
   * @param value
   */
  public onSave(value): void {
    this.submitted = true;

    let obj = {
      _id: this.model ? this.model._id : null,
      ...value
    };

    let keyword = new ReserveKeywordModel(obj);
    // if it's creating
    // then call create method
    this.reserveSubscription = this._keywordService
      .reserve(keyword)
      .subscribe(() => {
        // Toast message
        this._toast.success('Create Keyword Successful.', 'Success');

        this.submitted = false;

        this.onCancel({success: true});
      }, (err) => {
        if (err.errorMessage === 'exists') {
          this._toast.error('The keyword already existed, please choose another.', 'Error');
        } else {
          this._toast.error(err.errorMessage, 'Error');
        }

        this.submitted = false;
      });
  }

  /**
   * Cancel button callback
   * @param e
   */
  public onCancel(e?: any): void {
    this.modalInstance.close(e);
  }

  public ngOnDestroy(): void {
    if (this.reserveSubscription) {
      this.reserveSubscription.unsubscribe();
    }

    if (this.codeSubscription) {
      this.codeSubscription.unsubscribe();
    }

    if (this.formChangeSubscription) {
      this.formChangeSubscription.unsubscribe();
    }
  }
}
