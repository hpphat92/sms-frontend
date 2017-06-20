import {
  Routes
} from '@angular/router';

import {
  SignInComponent
} from './sign-in.component';

export const routes: Routes = [
  {
    path: 'auth/sign-in', component: SignInComponent,
    data: {pageTitle: 'Sign in', className: 'sign-in-page'}
  }
];
