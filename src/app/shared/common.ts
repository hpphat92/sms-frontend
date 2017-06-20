import {
  CommonModule
} from '@angular/common';

import {
  NgModule
} from '@angular/core';

import {
  FormsModule, ReactiveFormsModule
} from '@angular/forms';

import {
  HttpModule,
  Http, RequestOptions
} from '@angular/http';

import {
  RouterModule
} from '@angular/router';

import {
  RouterLinkOptionsDirective
} from '../core/router';

/*******************************
 * Material Components
 *******************************/

import {
  MdInputModule,
  MdCheckboxModule,
  MdRippleModule,
  MdButtonModule,
  MdIconModule,
  MdProgressSpinnerModule,
  MdMenuModule,
  MdSelectModule,
  MdTabsModule,
  MdListModule,
  MdIconRegistry,
  MdTooltipModule
} from '@angular/material';

const ANGULAR_MATERIAL_COMPONENTS = [
  MdInputModule,
  MdCheckboxModule,
  MdRippleModule,
  MdButtonModule,
  MdIconModule,
  MdProgressSpinnerModule,
  MdMenuModule,
  MdSelectModule,
  MdTabsModule,
  MdListModule,
  MdTooltipModule
];

import {
  LocalStorageModule
} from 'angular-2-local-storage';

import {
  PerfectScrollbarModule,
  PerfectScrollbarConfigInterface
} from 'ngx-perfect-scrollbar';

const PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

import {
  SidebarModule
} from 'ng-sidebar';

import {
  MomentModule
} from 'angular2-moment';

import { ToastrModule } from 'ngx-toastr';

import { TextMaskModule } from 'angular2-text-mask/src/angular2TextMask';

import { Ng2FilterPipeModule } from 'ng2-filter-pipe';

import { DatePickerModule } from 'ngx-material-datepicker';

// this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { NgIdleKeepaliveModule } from '@ng-idle/keepalive';

// import {
//   TranslateModule,
//   TranslateService,
//   TranslateLoader
// } from '@ngx-translate/core';
//
// import {
//   TranslateHttpLoader
// } from '@ngx-translate/http-loader';

//// AoT requires an exported function for factories
// export function HttpLoaderFactory(http: Http) {
//   return new TranslateHttpLoader(http, "/assets/i18n/", ".json");
// }

// import {
//   AppI18n,
//   Translation
// } from './modules/i18n';
//
// export * from './modules/i18n';

/*******************************
 * AngularJS Material Components
 *******************************/

import {
  CUSTOM_MATERIAL_COMPONENTS
} from '../core/material';

/*******************************
 * Kendo Components
 *******************************/
import {
  GridModule
} from '@progress/kendo-angular-grid';

import {
  DialogModule
} from '@progress/kendo-angular-dialog';

import { ButtonsModule } from '@progress/kendo-angular-buttons';

const KENDO_COMOPNENTS = [
  GridModule,
  DialogModule,
  ButtonsModule
];

import {
  PageFooterComponent
} from '../shared/components/page-footer';

export const ROOT_MODULES = [
  // Angular modules
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  HttpModule,

  ToastrModule.forRoot(), // enable service injection

  // 3rd parties modules
  LocalStorageModule.withConfig({
    prefix: 'nois',
    storageType: 'localStorage'
  }),

  // AppI18n.forRoot([
  //   {
  //     code: 'en',
  //     name: 'English'
  //   },
  //   {
  //     code: 'vi',
  //     name: 'Vietnamese'
  //   }
  // ]),
  //
  // TranslateModule.forRoot({
  //   loader: {
  //     provide: TranslateLoader,
  //     useFactory: HttpLoaderFactory,
  //     deps: [Http]
  //   }
  // }),

  PerfectScrollbarModule.forRoot(PERFECT_SCROLLBAR_CONFIG),
  SidebarModule,
  NgIdleKeepaliveModule.forRoot()
];

import { ExtendedHttpService } from './services/http/http.service';

import { FileUploadModule } from 'ng2-file-upload';

export const CHILD_MODULES = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  HttpModule,
  LocalStorageModule,
  SidebarModule,
  // TranslateModule,
  PerfectScrollbarModule,
  // AppI18n,
  ToastrModule,
  MomentModule,
  TextMaskModule,
  Ng2FilterPipeModule,
  FileUploadModule,

  ...ANGULAR_MATERIAL_COMPONENTS,
  ...KENDO_COMOPNENTS,
  DatePickerModule
];

import {
  AUTH_PROVIDERS,
  AuthHttp,
  AuthConfig
} from 'angular2-jwt';

// https://github.com/auth0/angular2-jwt/issues/158
export function authFactory(http: Http, options: RequestOptions) {
  return new AuthHttp(new AuthConfig({
    // Config options if you want
  }), http, options);
}

export const authProvider = {
  provide: AuthHttp,
  deps: [Http, RequestOptions],
  useFactory: authFactory
};

@NgModule({
  imports: [
    ...CHILD_MODULES,
  ],
  declarations: [
    RouterLinkOptionsDirective,
    PageFooterComponent,
    ...CUSTOM_MATERIAL_COMPONENTS
  ],
  exports: [
    ...CHILD_MODULES,
    RouterLinkOptionsDirective,
    PageFooterComponent,
    ...CUSTOM_MATERIAL_COMPONENTS
  ],
  providers: [
    ExtendedHttpService
  ]
})
export class SharedCommonModule {
  // constructor(private _translateService: TranslateService,
  //             private _translation: Translation) {
  //
  //  the lang to use, if the lang isn't available, it will use the current loader to get them
  //   // _translateService.use(_translation.userLang);
  //
  //   // This will fix lazyLoaded modules not binding translation changes event
  //   _translation.onTranslationChange.subscribe((trans) => {
  //     _translateService.use(trans.code);
  //   });
  //
  //   // Default translation configuration
  //   _translateService.setDefaultLang(_translation.userLang);
  //   _translateService.use(_translation.userLang);
  // }

  constructor(private _mdIconRegistry: MdIconRegistry) {
    _mdIconRegistry.registerFontClassAlias('fontawesome', 'fa');
  }
}
