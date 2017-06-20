import {
  Routes
} from '@angular/router';
import {
  SubscriberListsComponent
} from './subscriber-lists.component';

import { SubscriberListBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export const routes: Routes = [
  {
    path: '', component: SubscriberListsComponent,
    data: {pageTitle: 'Subscriber Lists', className: 'subscriber-lists'}
  },
  {
    path: '', component: SubscriberListBreadcrumbComponent,
    outlet: 'breadcrumb'
  }
];
