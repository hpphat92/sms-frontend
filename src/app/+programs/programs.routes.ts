import {
  Routes
} from '@angular/router';

import {
  ProgramsComponent
} from './programs.component';

import {
  ManageProgramsComponent
} from './components/manage-programs/manage-programs.component';

import {
  CreateOrUpdateOptInProgramComponent
} from './components/create-or-update-opt-in-program/create-or-update-opt-in-program.component';

import {
  CreateOrUpdateBroadcastProgramComponent
} from './components/create-or-update-broadcast-program/create-or-update-broadcast-program.component';
import { DeactivateGuardService } from '../shared/services/deactive-guard/deactivate-guard.service';
import { ProgramBreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

export const routes: Routes = [
  {
    path: '',
    component: ManageProgramsComponent,
    data: {pageTitle: 'Programs', className: 'manage-programs', type: 'manage'}
  },
  {
    path: 'opt-in/create',
    component: CreateOrUpdateOptInProgramComponent,
    data: {pageTitle: 'Create Opt-In Program', className: 'create-opt-in-programs', type: 'opt-in', action: 'create'},
    canDeactivate: [DeactivateGuardService]
  },
  {
    path: 'opt-in/:program-id/edit',
    component: CreateOrUpdateOptInProgramComponent,
    data: {pageTitle: 'Edit Opt-In Program', className: 'edit-opt-in-programs', type: 'opt-in', action: 'edit'},
    canDeactivate: [DeactivateGuardService]
  },
  {
    path: 'broadcast/create',
    component: CreateOrUpdateBroadcastProgramComponent,
    data: {
      pageTitle: 'Create Broadcast Program',
      className: 'create-broadcast-programs',
      type: 'broadcast',
      action: 'create'
    },
    canDeactivate: [DeactivateGuardService]
  },
  {
    path: 'broadcast/:program-id/edit',
    component: CreateOrUpdateBroadcastProgramComponent,
    data: {
      pageTitle: 'Edit Broadcast Program',
      className: 'edit-broadcast-programs',
      type: 'broadcast',
      action: 'edit'
    },
    canDeactivate: [DeactivateGuardService]
  },
  {
    path: '', component: ProgramBreadcrumbComponent,
    outlet: 'breadcrumb'
  }
];
