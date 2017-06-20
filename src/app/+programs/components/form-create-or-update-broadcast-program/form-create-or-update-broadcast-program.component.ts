import {
  Component,
  ViewEncapsulation,
  OnInit,
  Input,
  ViewChild, OnDestroy
} from '@angular/core';

import {
  FormControl,
  Validators,
} from '@angular/forms';

import {
  ValidationService,
  ExtraValidators
} from '../../../shared/services/validation/validation.service';

import {
  BroadcastFormControl,
  BroadcastProgramModel,
  ScheduleTypeList,
  ProgramStatus
} from '../../programs.model';

import { ToastrService } from 'ngx-toastr';

import { Router } from '@angular/router';

import moment from 'moment';
import { ValidDateTime } from '../../../shared/validators/valid-datetime.validator';
import { MdTextareaAutosize } from '@angular/material';
import { ProgramsService } from '../../programs.service';
import { DateRange } from '../../../shared/validators/date-range.validator';

import { Util } from '../../../shared/services/util/util.service';

import { ConfirmChangeStatusComponent } from './confirm-change-status.component';
import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';
import { Subject } from 'rxjs/Subject';
import { AppConstant } from '../../../app.constant';
import { UserContext } from '../../../shared/services/user-context/user-context';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  // <broadcast-create-or-update></broadcast-programs-create-or-update>
  selector: 'form-broadcast-program-create-or-update',
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'form-create-or-update-broadcast-program.template.html',
  styleUrls: ['form-create-or-update-broadcast-program.style.scss'],
  providers: [ValidationService]
})
export class FormBroadcastProgramCreateOrUpdateComponent implements OnInit, OnDestroy {

  @Input() public currentCampaign: any;

  @Input() public broadcastProgramId: string;

  @Input()
  public currentSubscriberList: any;

  public currentProgram: any;

  public scheduleTypeList = ScheduleTypeList;

  public formErrors = {
    name: '',
    scheduleDateTimeStart: '',
    scheduleDateTimeEnd: ''
  };

  public validationMessages = {
    name: {
      required: 'Name is required.'
    },
    scheduleDateTimeStart: {
      required: '',
      dateTimeInvalid: `A valid date/time in the future at least ten
       (10) minutes in the future from the time the user is saving the program.`
    },

    scheduleDateTimeEnd: {
      dateRangeInvalid: 'The end date/time have to occur after the start date/time.'
    }
  };

  public controlConfig = {
    name: new FormControl('', [
      Validators.required
    ]),
    code_id: new FormControl('', [
      Validators.required
    ]),
    content: new FormControl('', [
      Validators.required
    ]),
    insert_sql: new FormControl('', this.currentSubscriberList && this.currentSubscriberList.remote ? [
      Validators.required
    ] : []),
    select_sql: new FormControl('', this.currentSubscriberList && this.currentSubscriberList.remote ? [
      Validators.required
    ] : []),
    template: new FormControl('N/A', []),
    scheduleDateTimeStart: new FormControl('', [
      Validators.required,
      // ValidDateTime(10, 'minutes')
    ]),
    scheduleDateTimeEnd: new FormControl('', [], [
      DateRange('scheduleDateTimeStart')
    ]),
    maxRecur: new FormControl('nomax'),
    timeOfDay: new FormControl('', [
      // only required in weekly or monthly schedule
      Validators.compose([
        ExtraValidators.conditional(
          (group) => group.get('scheduleType').value !== this.scheduleTypeList[0].id,
          Validators.compose([
            Validators.required,
          ])
        ),
      ])
    ]),
    days: new FormControl([], [
      // only required in weekly schedule
      Validators.compose([
        ExtraValidators.conditional(
          (group) => group.get('scheduleType').value === this.scheduleTypeList[1].id,
          Validators.compose([
            Validators.required,
          ])
        ),
      ])
    ]),
    scheduleType: new FormControl(this.scheduleTypeList[0].id),
    scheduleStatus: new FormControl('true'),
    dayOfMonth: new FormControl(15)
  };

  public frm: any;

  public campaigns: any[] = [];
  public campaignsSelected: any[] = [];

  public shortCodes: any[] = [];

  public templates: any[] = [];

  public Math: any;

  public isSubmit: boolean = false;

  public dayInMonths: number[] = [];

  @ViewChild('autosize')
  public autosize: MdTextareaAutosize;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private _validationService: ValidationService,
              private _programService: ProgramsService,
              private _toast: ToastrService,
              private _router: Router,
              private _util: Util,
              private _confirmService: ConfirmService,
              private _userContext: UserContext) {
    this.Math = Math;
  }

  public ngOnInit(): void {
    this.dayInMonths = this._util.getDaysInCurrentMonth();

    // Build form
    this.frm = this._validationService.buildForm(this.controlConfig,
      this.formErrors, this.validationMessages);

    // Get campaigns
    this._programService.getCampaigns().subscribe((data) => {

      this.campaigns = data;
    });

    // Get codes
    this._programService.getShortCodes().subscribe((data) => {

      this.shortCodes = data;
    });

    // Get templates
    this._programService.getTemplates().subscribe((data) => {
      this.templates = data;
    });

    // Get detail program
    if (this.broadcastProgramId) {
      this._programService.getById(this.broadcastProgramId)
        .takeUntil(this._ngUnsubscribe)
        .subscribe((data) => {

          let broadcastProgramFormControl = new BroadcastFormControl(data);

          this.frm.reset(broadcastProgramFormControl);

          this.currentProgram = data;

          this.autosize.resizeToFitContent();
        });
    }
  }

  public onSave(value): void {
    // Save fn
    // Check schedule time
    let scheduleTime = moment(value.scheduleDateTimeStart);

    let plusTime = moment().add(10, 'minutes');

    // if (plusTime.diff(scheduleTime) > 0) {
    //   this._toast.error(`A valid date/time in the future at least ten
    //    (10) minutes in the future from the time the user is saving the program.`, 'Error');
    //   return;
    // }

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
    let dataPost = this.createDataPost(value);

    let broadcastProgramNew = new BroadcastProgramModel(dataPost);

    this._programService.create(broadcastProgramNew)
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data) => {
        this._toast.success('Create Broadcast Program Successful.', 'Success');

        // Reset form
        this.frm.reset();

        // back
        this.cancel();

        this.isSubmit = false;
      }, (err) => {
        this._toast.error(err.errorMessage, 'Error');
        this.isSubmit = false;
      });
  }

  public updateProgram(value): void {
    this.isSubmit = true;
    let dataPost = this.createDataPost(value);

    let broadcastProgram = new BroadcastProgramModel(dataPost);

    this._programService.update(broadcastProgram)
      .takeUntil(this._ngUnsubscribe)
      .subscribe((data) => {
        this._toast.success('Update Broadcast Program Successful.', 'Success');

        // Reset form
        this.frm.reset();

        // back
        this.cancel();

        this.isSubmit = false;
      }, (err) => {
        this._toast.error(err.errorMessage, 'Error');
        this.isSubmit = false;
      });
  }

  public updateSelectedList($event): void {
    this.campaignsSelected = $event;
  }

  public manageCampaign(): void {

    if (this.frm.get('name').dirty || this.frm.get('content').dirty) {
      let message = `You will loss data if you continue without saving.`;

      this._confirmService.show(message, (action) => {
        if (action === 'Yes') {
          this._router.navigate(['campaigns']);
        }
      });
    } else {
      this._router.navigate(['campaigns']);
    }

    // this._routerService.set({
    //   enableBackView: true,
    //   elemScroll: 'md-content'
    // });
    //
    // this._router.navigate(['campaigns']);
  }

  public cancel(): void {
    this._router.navigate(['campaigns', this.currentCampaign._id, 'programs']);
  }

  public changeTemplate(template: any): void {
    if (template !== 'N/A') {
      this.frm.get('content').patchValue(template.content);
      // this.frm.get('content').disable();
    } else {
      // this.frm.get('content').patchValue('');
      // this.frm.get('content').enable();
    }

    // Make text area auto size
    this.autosize.resizeToFitContent();

  }

  public changeScheduleStatus(value) {
    if (this.currentProgram && this.currentProgram.status === ProgramStatus.COMPLETED
      && value === 'false') {

      let message = `This program will be 'Staged' and not an active program if you continues.`;
      this._confirmService.show(message, (action) => {
        if (action === 'No' || !action) {
          this.frm.get('scheduleStatus').patchValue('true');
        }
      });
    }
  }

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }

  private createDataPost(value) {
    let accountId = this._userContext.currentUser.account_id || AppConstant.accountId;
    return {
      name: value.name,
      content: value.content,
      status: this.frm.valid ? 'scheduled' : 'staged',
      campaign_id: this.currentCampaign._id,
      schedule: {
        type: value.scheduleType,
        start: moment(value.scheduleDateTimeStart).toISOString(),
        end: value.scheduleDateTimeEnd ? moment(value.scheduleDateTimeEnd).toISOString() : '',
        time: value.timeOfDay ? moment(value.timeOfDay).format('hh:mm a') : '',
        days: value.days,
        enabled: value.scheduleStatus === 'true',
        day: value.dayOfMonth
      },
      code_id: value.code_id,
      insert_sql: value.insert_sql,
      select_sql: value.select_sql,
      _id: this.broadcastProgramId,
      account_id: accountId
    };
  }
}
