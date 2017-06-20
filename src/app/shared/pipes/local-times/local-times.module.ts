import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../../common';

import {
  LocalTimesPipe
} from './local-times.pipe';

@NgModule({
  imports: [
    SharedCommonModule
  ],
  exports: [
    LocalTimesPipe
  ],
  declarations: [
    LocalTimesPipe
  ],
})
export class LocalTimePipeModule {
}
