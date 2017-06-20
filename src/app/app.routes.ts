import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './shared/services/auth-guard';
import { AuthGuardChild } from './shared/services/auth-guard-child';
import { AuthLayoutComponent } from './shared/containers/auth-layout-container';
import { MainLayoutComponent } from './shared/containers/main-layout-container';
import { SimpleLayoutComponent } from './shared/containers/simple-layout-container';
import { SignInComponent } from './sign-in';
import { NotFoundComponent } from './not-found';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

export const ROUTES: Routes = [
  {
    path: '', component: MainLayoutComponent, canActivate: [AuthGuard],
    children: [
      {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
      {
        path: 'dashboard',
        loadChildren: './+dashboard/dashboard.module#DashboardModule'
      },
      {
        path: 'subscriber-list',
        loadChildren: './+subscriber-lists/subscriber-lists.module#SubscriberListsModule'
      },
      {
        path: 'campaigns',
        loadChildren: './+campaigns/campaigns.module#CampaignModule',
      },
      {
        path: 'campaigns/:id/programs',
        loadChildren: './+programs/programs.module#ProgramsModule'
      },
      {
        path: 'keywords',
        loadChildren: './+keywords/keywords.module#KeywordModule'
      },
      {
        path: 'users',
        loadChildren: './+users/users.module#UserModule'
      },
      {
        path: 'message-templates',
        loadChildren: './+message-templates/message-templates.module#MessageTemplatesModule'
      },
      {
        canActivate: [AuthGuardChild],
        path: 'remote-database',
        loadChildren: './+remote-database/remote-database.module#RemoteDatabaseModule'
      },
      {
        path: 'uploads',
        loadChildren: './+uploads/uploads.module#UploadModule'
      },
    ]
  },
  {
    path: 'auth', component: AuthLayoutComponent,
    children: [
      {path: '', redirectTo: 'sign-in', pathMatch: 'full'},
      {
        path: 'sign-in', component: SignInComponent,
        data: {pageTitle: 'Sign in', className: 'sign-in-page'}
      },
      {
        path: 'forgot-password', component: ForgotPasswordComponent,
        data: {pageTitle: 'Forgot Password', className: 'forgot-password-page'}
      }
    ]
  },
  {
    path: 'page', component: SimpleLayoutComponent,
    children: [
      {path: '', redirectTo: 'terms-and-conditions', pathMatch: 'full'},
      {path: 'terms-and-conditions', loadChildren: './+page/page.module#PageModule'},
      {path: 'privacy-policy', loadChildren: './+page/page.module#PageModule'},
      {path: 'about-us', loadChildren: './+page/page.module#PageModule'},

    ]
  },
  // { path: 'main',                     component: MainMaster, canActivate: [AuthGuardService],
  //   children: [
  //     { path: '',                     redirectTo: 'home', pathMatch: 'full' },
  //     { path: 'home',                 component: HomePage, data: {pageTitle: 'Sang Dao'} }
  //   ]
  // },
  // { path: 'common',                     component: CommonLayout,
  //   children:[
  //     { path: '',                       redirectTo: '404', pathMatch: 'full' },
  //     { path: '404',                    component: NotFoundPage}
  //   ]
  // },
  // { path: '**',                       component: NotFound}
  // { path: '**',                       redirectTo: '/common/404'}
  // { path: '',      component: HomeComponent },
  // { path: 'home',  component: HomeComponent },
  // { path: 'about', component: AboutComponent },
  // {
  //   path: 'detail', loadChildren: './pages/+detail#DetailModule',
  // },
  {path: '**', component: NotFoundComponent},
];
