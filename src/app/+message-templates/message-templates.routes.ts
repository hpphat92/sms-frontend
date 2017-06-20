import {
  Routes
} from '@angular/router';

import {
  MessageTemplatesComponent
} from './message-templates.component';
import { MessageTemplateBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export const routes: Routes = [
  {
    path: '', component: MessageTemplatesComponent,
    data: {pageTitle: 'Message Templates', className: 'message-templates'}
  },
  {
    path: '', component: MessageTemplateBreadcrumbComponent,
    outlet: 'breadcrumb'
  }
];
