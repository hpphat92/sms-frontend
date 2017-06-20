import {
  Routes
} from '@angular/router';
import {
  KeywordComponent
} from './keywords.component';
import { KeywordBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export const routes: Routes = [
  {
    path: '', component: KeywordComponent,
    data: {pageTitle: 'Keywords', className: 'keywords'}
  },
  {
    path: '', component: KeywordBreadcrumbComponent,
    outlet: 'breadcrumb'
  }
];
