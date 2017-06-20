import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../../common';

import {
  DualBoxComponent
} from './dual-box.component';

@NgModule({
  declarations: [
    DualBoxComponent,
  ],
  imports: [
    SharedCommonModule
  ],
  exports: [
    DualBoxComponent,
  ],
})
export class DualBoxModule {

}
