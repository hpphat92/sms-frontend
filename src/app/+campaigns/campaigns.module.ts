import {
  NgModule
} from '@angular/core';

import {
  RouterModule
} from '@angular/router';

import {
  SharedCommonModule
} from '../shared/common';

import {
  CampaignComponent
} from './campaigns.component';

import {
  routes
} from './campaigns.routes';

import {
  CampaignService
} from './campaigns.service';

import {
  COMPONENTS
} from './components';

import {
  CampaignCreateOrUpdateComponent
} from './components/create-or-update/create-or-update.component';

import {
  ConfirmChangeModule
} from '../shared/modules/confirm-change';

@NgModule({
  declarations: [
    CampaignComponent,
    ...COMPONENTS
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,

    ConfirmChangeModule
  ],
  providers: [
    CampaignService
  ],
  entryComponents: [
    CampaignCreateOrUpdateComponent
  ]
})
export class CampaignModule {
}
