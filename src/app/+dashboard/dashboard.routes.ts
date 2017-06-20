import {
  Routes
} from '@angular/router';
import {
  DashboardComponent
} from './dashboard.component';
import { DashboardBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export const routes: Routes = [
  {
    path: '', component: DashboardComponent,
    data: {pageTitle: 'Dashboard', className: 'dashboard'},
  },
  {
    path: '', component: DashboardBreadcrumbComponent,
    outlet: 'breadcrumb'
  }
];
