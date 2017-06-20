import {
  Routes
} from '@angular/router';
import {
  UserComponent
} from './users.component';
import { UserBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export const routes: Routes = [
  {
    path: '', component: UserComponent,
    data: {pageTitle: 'Users', className: 'users'}
  },
  {
    path: '', component: UserBreadcrumbComponent,
    outlet: 'breadcrumb'
  }
];
