import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../../common';

import {
  SimpleLayoutComponent
} from './simple-layout-container.component';


@NgModule({
  imports: [
    SharedCommonModule
  ],
  exports: [
    SimpleLayoutComponent
  ],
  declarations: [
    SimpleLayoutComponent
  ],
  providers: [],
  entryComponents: [],
})
export class SimpleLayoutModule {
}
