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

import 'rxjs/add/operator/map';

import 'rxjs/add/operator/take';
import { tokenNotExpired } from 'angular2-jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private _authService: AuthService, private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    let self = this;

    return new Promise((resolve) => {
      if (self._authService.isAuthenticated()) {
        self._authService.refreshToken((result) => {
          // If result === true then pass url else redirect to sign in page
          console.log(result);
          if (result) {
            resolve(true);

          } else {
            this.router.navigateByUrl('/auth/sign-in');
            resolve(false);
          }
        });
      } else {
        this.router.navigateByUrl('/auth/sign-in');
        resolve(false);
      }
    });
  }
}
