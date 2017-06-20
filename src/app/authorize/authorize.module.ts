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
  SHARED_DIRECTIVE_MODULES
} from '../shared/directives';

import {
  AuthorizeComponent
} from './authorize.component';

import {
  routes
} from './authorize.routes';

@NgModule({
  declarations: [
    AuthorizeComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    SHARED_DIRECTIVE_MODULES
  ]
})
export class AuthorizeModule {
}
