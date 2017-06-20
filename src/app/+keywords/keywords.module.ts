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
  KeywordComponent
} from './keywords.component';

import {
  routes
} from './keywords.routes';

import {
  KeywordService
} from './keywords.service';

import {
  COMPONENTS
} from './components';

import {
  UppercaseDirectiveModule
} from '../shared/directives/uppercase';

import {
  ReserveKeywordFormComponent
} from './components/reserve-keyword-form/reserve-keyword-form.component';

import {
  ConfirmChangeModule
} from '../shared/modules/confirm-change';

@NgModule({
  declarations: [
    KeywordComponent,
    ...COMPONENTS
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
    UppercaseDirectiveModule,

    ConfirmChangeModule
  ],
  providers: [
    KeywordService
  ],
  exports: [],
  entryComponents: [
    ReserveKeywordFormComponent
  ]
})
export class KeywordModule {
}
