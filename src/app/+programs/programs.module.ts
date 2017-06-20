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
  ProgramsComponent
} from './programs.component';

import {
  routes
} from './programs.routes';

import {
  ProgramsService
} from './programs.service';

import {
  COMPONENTS
} from './components';

import {
  DualBoxModule
} from '../shared/modules/dual-box';

import {
  ConfirmChangeModule
} from '../shared/modules/confirm-change';

@NgModule({
  declarations: [
    ProgramsComponent,
    ...COMPONENTS
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,

    DualBoxModule,
    ConfirmChangeModule
  ],
  providers: [
    ProgramsService
  ],
  exports: []
})
export class ProgramsModule {
}
