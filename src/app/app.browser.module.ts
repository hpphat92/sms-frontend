import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule, PreloadAllModules} from '@angular/router';
import { UniversalModule, isBrowser, isNode } from 'angular2-universal/browser'; // for AoT we need to manually split universal packages


/***********************
 * FIREBASE
 ***********************/

import {AngularFireModule} from 'angularfire2';
import {firebaseConfig, myFirebaseAuthConfig} from './shared/modules/firebase/app.firebase';

/***********************
 * END FIREBASE
 ***********************/

/***********************************
 * ANGULAR2-PERFECT-SCROLLBAR
 ***********************************/
import {PerfectScrollbarModule} from 'angular2-perfect-scrollbar';
import {PerfectScrollbarConfigInterface} from 'angular2-perfect-scrollbar';
const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

/***********************************
 * END ANGULAR2-PERFECT-SCROLLBAR
 ***********************************/

import 'd3';

/***********************************
 * NG2-NVD3
 ***********************************/
import 'nvd3';
import {NvD3Module} from 'ng2-nvd3';
/***********************************
 * END NG2-NVD3
 ***********************************/

/***********************************
 * NG2-RICKSHAW
 ***********************************/
import 'rickshaw';
import {RickshawModule} from 'ng2-rickshaw';
// import {RickshawModule} from './modules/ng2-rickshaw';
/***********************************
 * END NG2-RICKSHAW
 ***********************************/


/***********************************
 * Angular2-ui-switch
 ***********************************/
import { UiSwitchModule } from 'angular2-ui-switch'
/***********************************
 * Angular2-ui-switch END
 ***********************************/


import { SidebarModule } from 'ng-sidebar';

// App Styles
import '../styles/styles.scss';

/*
 * Platform and Environment providers/directives/pipes
 */
import {ENV_PROVIDERS} from './environment';
import {ROUTES} from './app.routes';

// App is our top level component
import {AppComponent} from './app.component';

import {SHARED_COMPONENTS, SHARED_LAYOUT_CONTAINERS, SHARED_DIRECTIVES, SHARED_PIPES, SHARED_SERVICES, SHARED_MODULES} from './shared';

import {HomeComponent} from './home';
import {AboutComponent} from './about';
import {XLargeDirective} from './home/x-large';
import {SignInComponent} from './sign-in';
import {SignUpComponent} from './+sign-up';
import {ForgotPasswordComponent} from './+forgot-password';
import {NotFoundComponent} from './not-found';
import {DashboardComponent} from './+dashboard';

// Application wide
const APP_PROVIDERS = [
  ...SHARED_SERVICES
];

export const CONTAINERS = [
  HomeComponent,
  AboutComponent,
  XLargeDirective,
  SignInComponent,
  SignUpComponent,
  ForgotPasswordComponent,
  NotFoundComponent,
  DashboardComponent
];

const APP_DECLARATION = [
  ...SHARED_PIPES,
  ...SHARED_DIRECTIVES,
  ...SHARED_LAYOUT_CONTAINERS,
  ...SHARED_COMPONENTS,
  ...CONTAINERS,
  AppComponent
];

/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [AppComponent],
  declarations: APP_DECLARATION,
  imports: [ // import Angular's modules
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    HttpModule,
    RouterModule.forRoot(ROUTES, {useHash: true, preloadingStrategy: PreloadAllModules}),
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig),
    PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
    NgbModule.forRoot(),
    NvD3Module,
    RickshawModule,
    UiSwitchModule,
    SidebarModule,
    ...SHARED_MODULES
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    ENV_PROVIDERS,
    APP_PROVIDERS,
    { provide: 'isBrowser', useValue: isBrowser },
    { provide: 'isNode', useValue: isNode }
  ]
})
export class AppModule {
}

