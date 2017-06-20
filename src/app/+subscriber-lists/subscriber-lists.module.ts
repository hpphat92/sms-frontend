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
  SubscriberListsComponent
} from './subscriber-lists.component';

import {
  routes
} from './subscriber-lists.routes';

import {
  SubscriberListsService
} from './subscriber-lists.service';

import {
  SubscriberService
} from './components/create-subscriber/subscriber.service';
import {
  SUBSCRIBER_LISTS_COMPONENTS
} from './components';

import {
  SubscriberListCreateOrUpdateComponent
} from './components/create-or-update/create-or-update.component';

import {
  CreateSubscriberComponent
} from './components/create-subscriber/create-subscriber.component';

import {
  ConfirmChangeModule
} from '../shared/modules/confirm-change';

@NgModule({
  declarations: [
    SubscriberListsComponent,
    ...SUBSCRIBER_LISTS_COMPONENTS
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,

    ConfirmChangeModule
  ],
  providers: [
    SubscriberListsService,
    SubscriberService
  ],
  exports: [],

  // register component that will be created dynamically
  entryComponents: [
    SubscriberListCreateOrUpdateComponent,
    CreateSubscriberComponent
  ],
})
export class SubscriberListsModule {
}
