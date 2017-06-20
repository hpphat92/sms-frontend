import {
  Routes
} from '@angular/router';
import {
  RemoteDatabaseComponent
} from './remote-database.component';
import { RemoteDatabaseBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export const routes: Routes = [
  {
    path: '', component: RemoteDatabaseComponent,
    data: {pageTitle: 'Remote Database Connection', className: 'remote-database'}
  },
  {
    path: '', component: RemoteDatabaseBreadcrumbComponent,
    outlet: 'breadcrumb'
  }
];
