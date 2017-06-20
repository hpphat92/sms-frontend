import {
  Component, OnDestroy,
  OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';

import {
  FormOptInProgramCreateOrUpdateComponent
} from '../form-create-or-update-opt-in-program/form-create-or-update-opt-in-program.component';

import { ProgramsService } from '../../programs.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';

@Component({
  selector: 'create-or-update-opt-in-programs',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'create-or-update-opt-in-program.template.html',
  styleUrls: ['create-or-update-opt-in-program.style.scss']
})
export class CreateOrUpdateOptInProgramComponent implements OnInit, OnDestroy {

  public campaignId: string;
  public currentCampaign: any;
  public optInProgramId: string;
  public currentSubscriberList: any;

  @ViewChild(FormOptInProgramCreateOrUpdateComponent)
  public createOrUpdateComponent: FormOptInProgramCreateOrUpdateComponent;

  public subscriptionCampaign: any;
  public subscriptionSubscriberList: any;

  constructor(private activatedRoute: ActivatedRoute,
              private _programService: ProgramsService,
              private _confirmService: ConfirmService) {

  }

  public ngOnInit(): void {
    Observable.combineLatest(this.activatedRoute.params, this.activatedRoute.parent.params)
      .forEach((params: Params[]) => {
        this.campaignId = params[1]['id'];

        this.optInProgramId = params[0]['program-id'];

        // get campaign detail
        this.subscriptionCampaign = this._programService
          .getDetailsCampaign(this.campaignId)
          .subscribe((data) => {
            this.currentCampaign = data;
            // share current campaign to service
            this._programService.currentCampaign = data;

            if (this.currentCampaign.list_id) {
              this.subscriptionSubscriberList = this._programService
                .getSubscriberListById(this.currentCampaign.list_id)
                .subscribe((subscriberList) => {
                  this.currentSubscriberList = subscriberList;
                });
            }

          });
      });
  }

  /**
   * Can deactive.
   * @returns {Promise<boolean>}
   */
  public canDeactivate(): Promise<boolean> {
    // Return promise for can deactive component.
    // Resolve true if you want to deactive otherwise is prevent deactive
    return new Promise((resolve) => {
      // If content field edited then show confirm leave else pass leaving
      if (this.createOrUpdateComponent.frm.get('content').dirty ||
        this.createOrUpdateComponent.frm.get('name').dirty) {
        let message = `Leaving the page will result in a loss of content. Are you sure?`;
        this._confirmService.show(message, (action) => {
          if (action === 'Yes') {
            resolve(true);
          } else {
            resolve(false);
          }
        });
      } else {
        resolve(true);
      }
    });
  }

  /**
   * Destroy componnet
   */
  public ngOnDestroy(): void {
    // Unsubscribe observable
    if (this.subscriptionCampaign) {
      this.subscriptionCampaign.unsubscribe();
    }

    if (this.subscriptionSubscriberList) {
      this.subscriptionSubscriberList.unsubscribe();
    }
  }
}
