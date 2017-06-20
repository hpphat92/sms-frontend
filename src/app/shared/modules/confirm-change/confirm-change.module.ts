import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../../common';

import {
  ConfirmChangeComponent
} from './confirm-change.component';

import { ConfirmService } from './confirm-change.service';

@NgModule({
  declarations: [
    ConfirmChangeComponent,
  ],
  imports: [
    SharedCommonModule
  ],
  providers: [
    ConfirmService
  ],
  entryComponents: [
    ConfirmChangeComponent
  ]
})
export class ConfirmChangeModule {

}
