import {
  Routes
} from '@angular/router';

import {
  UploadsComponent
} from './uploads.component';
import { UploadBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export const routes: Routes = [
  {
    path: '', component: UploadsComponent,
    data: {pageTitle: 'Upload', className: 'upload-page'}
  },
  {
    path: '', component: UploadBreadcrumbComponent,
    outlet: 'breadcrumb'
  }
];
