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
  UploadsComponent
} from './uploads.component';

import {
  routes
} from './uploads.routes';

import {
  UploadService
} from './uploads.service';

import {
  UPLOAD_COMPONENTS
} from './components';

@NgModule({
  declarations: [
    UploadsComponent,

    ...UPLOAD_COMPONENTS
  ],
  imports: [
    RouterModule.forChild(routes),
    SharedCommonModule,
  ],
  providers: [
    UploadService
  ]
})
export class UploadModule {
}
