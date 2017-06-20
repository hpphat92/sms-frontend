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
  MessageTemplatesComponent
} from './message-templates.component';

import {
  routes
} from './message-templates.routes';

import {
  MessageTemplateService
} from './message-templates.service';

import {
  MESSAGE_TEMPLATES_COMPONENTS
} from './components';

import {
  MessageTemplatesCreateOrUpdateComponent
} from './components/create-or-update/create-or-update.component';

import {
  ConfirmChangeModule
} from '../shared/modules/confirm-change';

@NgModule({
  declarations: [
    MessageTemplatesComponent,
    ...MESSAGE_TEMPLATES_COMPONENTS
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,

    ConfirmChangeModule
  ],
  providers: [
    MessageTemplateService
  ],
  exports: [],

  // register component that will be created dynamically
  entryComponents: [
    MessageTemplatesCreateOrUpdateComponent
  ],
})
export class MessageTemplatesModule {
}
