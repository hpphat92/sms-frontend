import {
  Component, OnDestroy, OnInit,
  ViewEncapsulation
} from '@angular/core';

import { ActivatedRoute, NavigationEnd, Params, Router } from '@angular/router';

import * as _ from 'lodash';
import { ProgramsService } from '../../programs.service';

@Component({
  selector: 'manage-programs',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'manage-programs.template.html',
  styleUrls: ['manage-programs.style.scss']
})
export class ManageProgramsComponent implements OnInit, OnDestroy {

  public campaignId: any;
  public currentCampaign;
  public listKeyword: string[] = [];

  public subscriptionParam: any;
  public subscriptionCampaign: any;
  public subscriptionProgram: any;
  public subscriptionRouter: any;

  constructor(private activatedRoute: ActivatedRoute,
              private _programService: ProgramsService,
              private _router: Router) {

  }

  public ngOnInit(): void {
    this.subscriptionParam = this.activatedRoute.params.subscribe((params: Params) => {
      this.campaignId = params['id'];

      // get campaign detail
      this.subscriptionCampaign = this._programService
        .getDetailsCampaign(this.campaignId)
        .subscribe((data) => {
          this.currentCampaign = data;

          this._programService.currentCampaign = data;
        });

      this.subscriptionProgram = this._programService
        .getList()
        .subscribe((data) => {
          data
            .filter((program) => {
              return program.keywords && program.keywords.length > 0;
            })
            .forEach((f) => {
              Array.prototype.push.apply(this.listKeyword, f.keywords.map((k) => {
                return k.keyword;
              }));
            });

          if (this.listKeyword.length) {
            this.listKeyword = _.uniq(this.listKeyword);
          }
        });
    });

    // Scroll to hash tag if have
    this.subscriptionRouter = this._router.events.subscribe((s) => {
      if (s instanceof NavigationEnd) {
        const tree = this._router.parseUrl(this._router.url);
        if (tree.fragment) {
          // you can use DomAdapter
          const element = document.querySelector('#' + tree.fragment);
          if (element) {
            element.scrollIntoView(element);
          }
        }
      }
    });
  }

  public ngOnDestroy(): void {
    if (this.subscriptionParam) {
      this.subscriptionParam.unsubscribe();
    }

    if (this.subscriptionCampaign) {
      this.subscriptionCampaign.unsubscribe();
    }

    if (this.subscriptionProgram) {
      this.subscriptionProgram.unsubscribe();
    }

    if (this.subscriptionRouter) {
      this.subscriptionRouter.unsubscribe();
    }
  }
}
