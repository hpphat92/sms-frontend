import {
  Injectable
}      from '@angular/core';
import {
  tokenNotExpired
} from 'angular2-jwt';
import {
  AppConstant
}     from '../../../app.constant';

import * as Auth0 from 'auth0-js/build/auth0';
import {
  UserContext
} from '../user-context/user-context';
import {
  Http
} from '@angular/http';
import {
  Observable
} from 'rxjs/Observable';
import {
  Router
} from '@angular/router';

import {
  ToastrService
} from 'ngx-toastr';

import 'rxjs/add/operator/timeInterval';

@Injectable()
export class AuthService {
  // Configure _auth0
  private _auth0 = new Auth0.WebAuth({
    domain: AppConstant.auth0.domain,
    clientID: AppConstant.auth0.clientID,
    redirectUri: AppConstant.auth0.redirectUri,
    responseType: 'token'
  });

  // https://auth0.com/docs/tokens/refresh-token
  private _refreshTokenObservable = Observable.interval(2700000); // 45 minutes
  private _refreshTokenSubscription: any;
  private _delegationSubscription: any;

  constructor(private _userContext: UserContext,
              private _http: Http,
              private _router: Router,
              private _toast: ToastrService) {
  }

  public handleAuthentication(): void {
    this._auth0.parseHash({_idTokenVerification: false}, (err, authResult) => {
      if (err) {
        alert(`Error: ${err.errorDescription}`);
      }

      if (authResult && authResult.accessToken && authResult.idToken) {
        // Save token to local storage
        this.setToken(authResult);

        this._getAuth0UserInfo(authResult, () => {
          this._getSMSCUserInfo(authResult, () => {
            window.location.hash = '';
          });
        });

        this.refreshToken();

        // Subscribe observable to get new id token when end of timeout
        this._refreshTokenSubscription = this._refreshTokenObservable.subscribe(() => {
          // Call request to get new token
          this._refreshToken();
        });
      }
    });
  }

  public refreshToken(cb?: any) {
    // Check if id_token expired then refresh token and start observable
    if (!tokenNotExpired('id_token') &&
      !!localStorage.getItem('access_token') &&
      !!localStorage.getItem('id_token')) {
      console.log('token expired ...');

      // unsubscribe old time out observable
      if (this._refreshTokenSubscription) {
        this._refreshTokenSubscription.unsubscribe();
      }

      // Subscribe observable to get new id token when end of timeout
      this._refreshTokenSubscription = this._refreshTokenObservable.subscribe(() => {
        this._refreshToken();
      });

      // Call request to get new token
      this._refreshToken(cb);

    } else {
      if (cb) {
        cb(true);
      }
    }
  }

  public login(username: string, password: string, cb: any): void {
    this._auth0.redirect.loginWithCredentials({
      connection: AppConstant.auth0.connection,
      username,
      password,
      scope: 'openid email name role account_id reference offline_access',
      device: 'my-device' // This is required params when scope has offline_access. Add device id if have
    }, cb);
  }

  public signup(email: string, password: string, cb: any): void {
    this._auth0.redirect.signupAndLogin({
      connection: AppConstant.auth0.connection,
      email,
      password,
      scope: 'openid email name role account_id reference offline_access',
      device: 'my-device' // This is required params when scope has offline_access. Add device id if have
    }, cb);
  }

  public loginWithGoogle(): void {
    this._auth0.authorize({
      connection: 'google-oauth2',
    });
  }

  public isAuthenticated(): boolean {
    // Check whether the id_token is expired or not
    return !!localStorage.getItem('access_token') && !!localStorage.getItem('id_token');
  }

  public isRole(roleName: string) {
    return this._userContext.currentUser.role === roleName;
  }

  public logout(): void {
    // Remove token from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('refresh_token');

    // Clear timeout refresh token
    if (this._refreshTokenSubscription) {
      this._refreshTokenSubscription.unsubscribe();
    }
  }

  /**
   * Auth forgot
   * @param email
   * @param cb
   */
  public forgot(email, cb) {
    this._auth0.changePassword({
      connection: AppConstant.auth0.connection,
      email
    }, cb);
  }

  private _getAuth0UserInfo(authResult, cb) {
    // Get auth0 user info
    this._http.get(`https://${AppConstant.auth0.domain}/userinfo`)
      .map((data) => data.json())

      .catch((error) => {
        if (error.status === 401) {
          this._toast.error('You don\'t have permission', 'Unauthorized');

          this.logout();
        }
        return Observable.empty();
      })
      .subscribe((profile) => {
        this._userContext.update(profile);
        if (cb) {
          cb();
        }
      });
  }

  private _getSMSCUserInfo(authResult, cb) {
    // Get auth0 user info
    this._http.get(`${AppConstant.domain}/users/${authResult.idTokenPayload.reference}`)
      .map((data) => data.json())
      // .catch((error) => {
      //   if (error.status === 401) {
      //     this._toast.error('You don\'t have permission', 'Unauthorized');
      //
      //     this.logout();
      //   }
      //   return Observable.empty();
      // })
      .subscribe((profile) => {
        this._userContext.update(profile);
        if (cb) {
          cb();
        }
      });
  }

  private setToken(authResult): void {
    // Save token from localStorage
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('refresh_token', authResult.refreshToken);
  }

  private _refreshToken(cb?: any) {

    let data = {
      client_id: AppConstant.auth0.clientID,
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      refresh_token: localStorage.getItem('refresh_token'),
      api_type: 'app',
      scope: 'openid email name role account_id reference offline_access'
    };

    // unsubscribe old request delegation observable
    if (this._delegationSubscription) {
      this._delegationSubscription.unsubscribe();
    }

    // Call api to get new id_token
    this._delegationSubscription = this._http.post(`https://${AppConstant.auth0.domain}/delegation`, data)
      .map((resp) => resp.json())
      .subscribe((resp: any) => {
        // save to storage
        localStorage.setItem('id_token', resp.id_token);

        if (cb) {
          cb(true);
        }

      }, (error) => {
        this._toast.error(error.json().error_description, 'Error');

        if (cb) {
          cb(false);
        }
      });
  }

  private handleError(error: Response) {
    let self = this;

    self._router.navigate(['auth', 'sign-in']);

    return Observable.throw(error.json());
  }
}
