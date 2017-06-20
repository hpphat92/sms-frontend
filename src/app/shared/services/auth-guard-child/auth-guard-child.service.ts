import {
  Injectable
} from '@angular/core';

import {
  CanActivate,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';

import {
  AuthService
} from '../../../shared/services/auth';

@Injectable()
export class AuthGuardChild implements CanActivate {
  constructor(private _authService: AuthService, private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let self = this;
    if (!self._authService.isRole('administrator') && !self._authService.isRole('manager')) {
      this.router.navigateByUrl('/dashboard');
      return false;
    }

    return true;
  }
}
