import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../../common';

import {
  BackButtonComponent
} from './back-button.component';

@NgModule({
  declarations: [
    BackButtonComponent,
  ],
  imports: [
    SharedCommonModule
  ],
  exports: [
    BackButtonComponent,
  ],
})
export class BackButtonModule {

}
