import {
  Routes
} from '@angular/router';

import {
  AuthorizeComponent
} from './authorize.component';

export const routes: Routes = [
  {
    path: 'access_token', component: AuthorizeComponent
  }
];
