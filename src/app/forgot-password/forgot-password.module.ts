import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../shared/common';

import {
  SHARED_DIRECTIVE_MODULES
} from '../shared/directives';

import {
  ForgotPasswordComponent
} from './forgot-password.component';

@NgModule({
  declarations: [
    ForgotPasswordComponent
  ],
  imports: [
    SharedCommonModule,
    SHARED_DIRECTIVE_MODULES
  ]
})
export class ForgotPasswordModule {
}
