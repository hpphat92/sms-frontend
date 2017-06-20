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
  UserComponent
} from './users.component';

import {
  routes
} from './users.routes';

import {
  UserService
} from './users.service';

import {
  COMPONENTS
} from './components';

import {
  UserCreateOrUpdateComponent
} from './components/create-or-update/create-or-update.component';

import {
  ConfirmChangeModule
} from '../shared/modules/confirm-change';

@NgModule({
  declarations: [
    UserComponent,
    ...COMPONENTS
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,

    ConfirmChangeModule
  ],
  providers: [
    UserService
  ],
  exports: [],
  // register component that will be created dynamically
  entryComponents: [
    UserCreateOrUpdateComponent
  ],
})
export class UserModule {
}
