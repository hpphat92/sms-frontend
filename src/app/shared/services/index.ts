import{
  Http
} from '@angular/http';

import { ThemeSetting } from './theme-setting';
import { AuthService } from './auth';
import { AuthGuardChild } from './auth-guard-child';
import { ProgressService } from './progress';
import { AuthGuard } from './auth-guard';
import { ExtendedHttpService } from './http';
import { UserContext } from './user-context';
import { NoisMedia } from './nois-media';
import { Util } from './util';

export const SHARED_SERVICES = [
  ThemeSetting,
  AuthGuard,
  AuthGuardChild,
  AuthService,
  UserContext,
  ProgressService,
  NoisMedia,
  Util,
  { provide: Http, useClass: ExtendedHttpService }
];

export * from './theme-setting';
export * from './auth';
export * from './auth-guard';
export * from './progress';
export * from './http';
export * from './user-context';
export * from './nois-media';
export * from './util';
export * from './auth-guard-child';
