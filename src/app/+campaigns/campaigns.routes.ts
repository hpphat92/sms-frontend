import {
  Routes
} from '@angular/router';
import {
  CampaignComponent
} from './campaigns.component';
import { CampaignBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export const routes: Routes = [
  {
    path: '', component: CampaignComponent,
    data: {pageTitle: 'Campaigns', className: 'campaigns'}
  },
  {
    path: '', component: CampaignBreadcrumbComponent,
    outlet: 'breadcrumb'
  }
];
