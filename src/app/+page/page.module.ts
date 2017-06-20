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
  PageComponent
} from './page.component';
import {
  PrivacyPolicyComponent
} from './components/privacy-policy/privacy-policy.component';
import {
  TermsAndConditionsComponent
} from './components/terms-and-condtions/terms-and-conditions.component';
import {
  AboutUsComponent
} from './components/about-us/about-us.component';
import {
  routes
} from './page.routes';

@NgModule({
  declarations: [
    PageComponent,
    PrivacyPolicyComponent,
    TermsAndConditionsComponent,
    AboutUsComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule
  ],
  exports: [
  ]
})
export class PageModule {}
