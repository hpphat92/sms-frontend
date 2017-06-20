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
  DashboardComponent
} from './dashboard.component';

import {
  routes
} from './dashboard.routes';

import {
  DASHBOARD_COMPONENTS
} from './components';

import {
  DashboardService
} from './dashboard.service';

import {
  LocalTimePipeModule
} from '../shared/pipes/local-times';

@NgModule({
  declarations: [
    DashboardComponent,

    ...DASHBOARD_COMPONENTS
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,

    LocalTimePipeModule
  ],
  providers: [
    DashboardService
  ],
  exports: []
})
export class DashboardModule {
}
