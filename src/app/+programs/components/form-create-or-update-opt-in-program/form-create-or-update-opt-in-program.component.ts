import {
  Component,
  ViewEncapsulation,
  OnInit, Input, ViewChild, OnDestroy
} from '@angular/core';

import {
  FormControl,
  Validators
} from '@angular/forms';

import { ValidationService } from '../../../shared/services/validation/validation.service';
import { OptInProgramFormControl, OptInProgramModel } from '../../programs.model';

import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';
import { ProgramsService } from '../../programs.service';

import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';

import { MdTextareaAutosize } from '@angular/material';
import { Subject } from "rxjs/Subject";
import { AppConstant } from "../../../app.constant";
import { UserContext } from "../../../shared/services/user-context/user-context";

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  // <opt-in-programs-create-or-update></opt-in-programs-create-or-update>
  selector: 'form-opt-in-program-create-or-update',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'form-create-or-update-opt-in-program.template.html',
  styleUrls: ['form-create-or-update-opt-in-program.style.scss'],
  providers: [ValidationService]
})
export class FormOptInProgramCreateOrUpdateComponent implements OnInit, OnDestroy {
  @ViewChild('autosize')
  public autosize: MdTextareaAutosize;

  @Input()
  public currentCampaign: any;

  @Input()
  public optInProgramId: string;

  @Input()
  public currentSubscriberList: any;

  public currentProgram: any;

  public formErrors = {
    name: '',
    optInType: ''
  };

  public validationMessages = {
    name: {
      required: 'Name is required.'
    },
    optInType: {
      required: 'Type is required.'
    }
  };

  public controlConfig = {
    name: new FormControl('', [
      Validators.required
    ]),
    optInType: new FormControl({value: 'KEYWORD', disabled: true}),
    keywords: new FormControl([], [
      Validators.required
    ]),
    content: new FormControl('', [
      Validators.required
    ]),
    sqlInsert: new FormControl(''),
    sqlSelect: new FormControl('')
  };

  public frm: any;

  public keywords = [];
  public keywordSelected = [];

  public Math: any;
  public isSubmit: boolean = false;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _validationService: ValidationService,
              private _programService: ProgramsService,
              private _toast: ToastrService,
              private _router: Router,
              private _confirmService: ConfirmService,
              private _userContext: UserContext) {
    this.Math = Math;
  }

  public ngOnInit(): void {

    // Build form
    this.frm = this._validationService.buildForm(this.controlConfig,
      this.formErrors, this.validationMessages);

    this._programService.getKeywordAvailable()
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data) => {
        this.keywords = _.map(data, (obj: any, idx) => {
          return {
            code_id: obj.codes && obj.codes.length ? obj.codes[0].code_id : null,
            keyword: obj._id,
            campaign: obj.codes && obj.codes.length ? obj.codes[0].campaign : null
          };
        });
      });

    if (this.optInProgramId) {
      this._programService.getById(this.optInProgramId)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          let optInProgramFormControl = new OptInProgramFormControl(data);

          this.frm.reset(optInProgramFormControl);

          if (data.keywords) {
            this.keywordSelected = data.keywords;
          }

          this.currentProgram = data;

          this.autosize.resizeToFitContent();
        });
    }
  }

  public onSave(value): void {
    // Save fn

    if (this.frm.invalid) {
      let message = `This program will be 'Staged' and not an active program if you continues.`;

      this._confirmService.show(message, (action) => {
        if (action === 'Yes') {
          if (this.currentProgram) {
            this.updateProgram(value);
          } else {
            this.createProgram(value);
          }
        }
      });
    } else {
      if (this.currentProgram) {
        this.updateProgram(value);

      } else {
        this.createProgram(value);

      }
    }
  }

  public createProgram(value): void {
    this.isSubmit = true;
    let accountId = this._userContext.currentUser.account_id || AppConstant.accountId;
    let dataPost = {
      name: value.name,
      content: value.content,
      keywords: value.keywords,
      status: this.frm.valid ? 'active' : 'staged',
      campaign_id: this.currentCampaign._id,
      insert_sql: value.sqlInsert,
      select_sql: value.sqlSelect,
      account_id: accountId
    };

    let optInProgramNew = new OptInProgramModel(dataPost);

    this._programService.create(optInProgramNew)
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data) => {
        this._toast.success('Create Opt-In Program Successful.', 'Success');

        // Reset form
        this.frm.reset();

        // back to list
        this.cancel();

        this.isSubmit = false;
      }, () => {
        this.isSubmit = false;
      });
  }

  public updateProgram(value): void {
    this.isSubmit = true;
    let accountId = this._userContext.currentUser.account_id || AppConstant.accountId;

    let dataPost = {
      name: value.name,
      content: value.content,
      keywords: value.keywords,
      status: this.frm.valid ? 'active' : 'staged',
      campaign_id: this.currentCampaign._id,
      _id: this.optInProgramId,
      insert_sql: value.sqlInsert,
      select_sql: value.sqlSelect,
      account_id: accountId
    };

    let optInProgram = new OptInProgramModel(dataPost);

    this._programService.update(optInProgram)
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data) => {
        this._toast.success('Update Opt-In Program Successful.', 'Success');

        // Reset form
        this.frm.reset();

        // back to list
        this.cancel();

        this.isSubmit = false;
      }, () => {
        this.isSubmit = false;
      });
  }

  /**
   * Update selected list callback
   * @param $event
   */
  public updateSelectedList($event): void {
    this.keywordSelected = $event;
  }

  /**
   * Manage keyword function
   */
  public manageKeyword(): void {
    this._router.navigate(['keywords']);
    // this._routerService.set({
    //   enableBackView: true,
    //   elemScroll: 'md-content'
    // });
    //
    // this._router.navigate(['keywords']);
  }

  /**
   * Back
   */
  public cancel(): void {
    this._router.navigate(['campaigns', this.currentCampaign._id, 'programs']);
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
