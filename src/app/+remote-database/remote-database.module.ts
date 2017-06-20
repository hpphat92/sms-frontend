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
  RemoteDatabaseComponent
} from './remote-database.component';

import {
  routes
} from './remote-database.routes';

import {
  RemoteDatabaseService
} from './remote-database.service';

import {
  SUBSCRIBER_LISTS_COMPONENTS
} from './components';

import {
  ConfirmChangeModule
} from '../shared/modules/confirm-change';

import {
  RemoteDatabaseCreateOrUpdateComponent
} from './components/create-or-update/create-or-update.component';

@NgModule({
  declarations: [
    RemoteDatabaseComponent,
    ...SUBSCRIBER_LISTS_COMPONENTS
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,

    ConfirmChangeModule
  ],
  providers: [
    RemoteDatabaseService
  ],
  exports: [],
  entryComponents: [
    RemoteDatabaseCreateOrUpdateComponent
  ]
})
export class RemoteDatabaseModule {
}
