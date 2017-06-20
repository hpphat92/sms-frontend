/***************************************************
 ******************* CONTAINERS ********************
 ***************************************************/
import { AuthLayoutComponent } from './auth-layout-container';
import { MainLayoutComponent } from './main-layout-container';
import { SimpleLayoutComponent } from './simple-layout-container';
import { PageHeaderComponent } from './main-layout-container/components/page-header';

export const SHARED_LAYOUT_CONTAINERS = [
  AuthLayoutComponent,
  MainLayoutComponent,
  SimpleLayoutComponent,
  PageHeaderComponent
];
