import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation,
  OnInit, OnDestroy
} from '@angular/core';

import {
  FormControl,
  Validators
} from '@angular/forms';
import { CampaignService } from '../../campaigns.service';
import {
  ExtraValidators,
  ValidationService
} from '../../../shared/services/validation/validation.service';
import {
  CampaignModel
} from '../../campaign.model';
import { AppConstant } from '../../../app.constant';
import { ToastrService } from 'ngx-toastr';
import { UserContext } from "../../../shared/services/user-context/user-context";

@Component({
  selector: 'campaign-create-or-update',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'create-or-update.template.html',
  providers: [ValidationService]
})
export class CampaignCreateOrUpdateComponent implements OnInit, OnDestroy {
  @Input()
  public isNew: boolean = false;

  @Input()
  public modalInstance: any;

  public formErrors = {
    name: '',
    description: '',
    help_msg: '',
    stop_msg: '',
    list_id: ''
  };

  public validationMessages = {
    name: {
      required: 'Name is required.',
      minlength: 'Name field is a at least 3 characters long and no greater than 255 characters',
      maxlength: 'Name field is a at least 3 characters long and no greater than 255 characters'
    },
    description: {
      required: 'Description is required.'
    },
    help_msg: {
      required: 'Help message is required.',
      maxlength: 'Help message is no greater than 160 characters'
    },
    stop_msg: {
      required: 'Stop message is required.',
      maxlength: 'Stop message is no greater than 160 characters'
    },
    list_id: {
      required: 'Subscriber List is required.',
    }
  };

  public controlConfig = {
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(255)
    ]),
    description: new FormControl('', Validators.required),
    help_msg: new FormControl('', [Validators.required, Validators.maxLength(160)]),
    stop_msg: new FormControl('', [Validators.required, Validators.maxLength(160)]),
    list_id: new FormControl('', [
      Validators.compose([
        ExtraValidators.conditional(
          (group) => this.isNew,
          Validators.compose([
            Validators.required
          ])
        ),
      ])
    ])
  };

  public frm: any;
  public active: boolean = false;
  public title: string = 'Create Campaign';

  @Input()
  public set model(campaign: any) {
    this.title = this.isNew ? 'Create Campaign' : `Edit: ${campaign.name}`;

    this._campaign = campaign;
  }

  public get model() {
    return this._campaign;
  }

  public subscriberListList: any[] = [];

  public subscriberList: any;

  public submitted: boolean = false;

  public subscriberListSubscription: any;
  public subscriberListDetailSubscription: any;
  public campaignCreateSubscription: any;
  public campaignUpdateSubscription: any;

  private _campaign: CampaignModel;

  constructor(private _validationService: ValidationService,
              private _campaignService: CampaignService,
              private _toast: ToastrService,
              private _userContext: UserContext) {

  }

  public ngOnInit(): void {
    this.frm = this._validationService.buildForm(this.controlConfig,
      this.formErrors, this.validationMessages);

    this.subscriberListSubscription = this._campaignService
      .getSubscriberList()
      .subscribe((data) => {
        this.subscriberListList = data;
      });

    // Call reset form to bind model to form
    if (this.model) {
      this.frm.reset(this.model);

      if (this.model.list_id) {
        this.subscriberListDetailSubscription = this._campaignService
          .getSubscriberListDetail(this.model.list_id)
          .subscribe((data) => {
            this.subscriberList = data;
          });
      }
    }
  }

  /**
   * Save button callback
   * @param value
   */
  public onSave(value): void {
    this.submitted = true;

    let obj = {
      _id: this.model ? this.model._id : null,
      account_id: this._userContext.currentUser.account_id || AppConstant.accountId,
      ...value
    };

    let campaign = new CampaignModel(obj);

    if (this.isNew) {
      // if it's creating
      // then call create method
      this.campaignCreateSubscription = this._campaignService
        .create(campaign)
        .subscribe((data) => {
          // Toast message
          this._toast.success('Create Campaign Successful.', 'Success');

          this.submitted = false;
          this.onCancel({success: true});
        }, (err) => {
          this.submitted = false;
          this._toast.error('Error', err.errorMessage);
        });
    } else {
      // otherwise, call update method
      this.campaignUpdateSubscription = this._campaignService
        .update(campaign)
        .subscribe((data) => {
          // Toast message
          this._toast.success('Update Campaign Successful.', 'Success');

          this.submitted = false;
          this.onCancel({success: true});
        }, (err) => {
          this.submitted = false;
          this._toast.error('Error', err.errorMessage);
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
    if (this.campaignUpdateSubscription) {
      this.campaignUpdateSubscription.unsubscribe();
    }

    if (this.subscriberListSubscription) {
      this.subscriberListSubscription.unsubscribe();
    }

    if (this.subscriberListDetailSubscription) {
      this.subscriberListDetailSubscription.unsubscribe();
    }

    if (this.campaignCreateSubscription) {
      this.campaignCreateSubscription.unsubscribe();
    }
  }
}
