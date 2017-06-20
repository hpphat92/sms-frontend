import {
  NgModule
} from '@angular/core';

import {
  SharedCommonModule
} from '../../common';

import {
  MainLayoutComponent
} from './main-layout-container.component';

import {
  PageHeaderComponent
} from './components/page-header';

import {
  BackButtonModule
} from '../../../shared/modules/back-button';


@NgModule({
  imports: [
    SharedCommonModule,
    BackButtonModule
  ],
  exports: [
    PageHeaderComponent,
    MainLayoutComponent
  ],
  declarations: [
    PageHeaderComponent,
    MainLayoutComponent
  ],
  providers: [],
  entryComponents: [],
})
export class MainLayoutModule {
}
