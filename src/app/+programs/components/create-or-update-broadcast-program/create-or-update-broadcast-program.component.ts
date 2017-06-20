import {
  Component, OnDestroy,
  OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';


import { ProgramsService } from '../../programs.service';

import {
  FormBroadcastProgramCreateOrUpdateComponent
} from '../form-create-or-update-broadcast-program/form-create-or-update-broadcast-program.component';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { ConfirmService } from '../../../shared/modules/confirm-change/confirm-change.service';
import { Subject } from "rxjs/Subject";

@Component({
  selector: 'create-or-update-broadcast-programs',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'create-or-update-broadcast-program.template.html',
  styleUrls: ['create-or-update-broadcast-program.style.scss']
})
export class CreateOrUpdateBroadcastProgramComponent implements OnInit, OnDestroy {

  public campaignId: string;
  public currentCampaign: any;
  public broadcastProgramId: string;
  public currentSubscriberList: any;

  @ViewChild(FormBroadcastProgramCreateOrUpdateComponent)
  public createOrUpdateComponent: FormBroadcastProgramCreateOrUpdateComponent;

  private _ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private activatedRoute: ActivatedRoute,
              private _programService: ProgramsService,
              private _confirmService: ConfirmService) {

  }

  public ngOnInit(): void {
    Observable.combineLatest(this.activatedRoute.params, this.activatedRoute.parent.params)
      .subscribe((params: Params) => {
        this.campaignId = params[1]['id'];

        this.broadcastProgramId = params[0]['program-id'];

        // get campaign detail
        this._programService.getDetailsCampaign(this.campaignId)
          .takeUntil(this._ngUnsubscribe)
          .subscribe((data) => {
            this.currentCampaign = data;
            this._programService.currentCampaign = data;

            if (this.currentCampaign.list_id) {
              this._programService
                .getSubscriberListById(this.currentCampaign.list_id)
                .takeUntil(this._ngUnsubscribe)
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
  public canDeactivate() {
    // Return promise for can deactive component.
    // Resolve true if you want to deactive otherwise is prevent deactive
    return new Promise((resolve) => {

      if (this.createOrUpdateComponent &&
        this.createOrUpdateComponent.frm.get('content').dirty) {

        let message = 'Leaving the page will result in a loss of content. Are you sure?';

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

  public ngOnDestroy(): void {
    this._ngUnsubscribe.next();
    this._ngUnsubscribe.complete();
  }
}
