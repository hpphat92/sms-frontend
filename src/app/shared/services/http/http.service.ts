import { Injectable } from '@angular/core';
import {
  Request,
  XHRBackend,
  RequestOptions,
  Response,
  Http,
  RequestOptionsArgs,
  Headers
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { UserContext } from '../user-context';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/toPromise';
import {
  AppConstant
} from '../../../app.constant';
import { ProgressService } from '../progress/progress.service';

// https://www.illucit.com/blog/2016/03/angular2-http-authentication-interceptor/
@Injectable()
export class ExtendedHttpService extends Http {

  private _httpCounter: number = 0;

  constructor(backend: XHRBackend,
              defaultOptions: RequestOptions,
              private router: Router,
              private userContext: UserContext,
              private progressService: ProgressService) {
    super(backend, defaultOptions);
  }

  public request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    // debugger;
    return this.intercept(super.request(url, this.getRequestOptionArgs(null, options)));
  }

  public get(url: string, options?: RequestOptionsArgs): Observable<Response> {
    // debugger;
    return this.intercept(super.get(url, this.getRequestOptionArgs(url, options)));
  }

  public post(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.post(url, body, this.getRequestOptionArgs(url, options)));
  }

  public put(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.put(url, body, this.getRequestOptionArgs(url, options)));
  }

  public delete(url: string, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.delete(url, this.getRequestOptionArgs(url, options)));
  }

  public patch(url: string, body: any, options?: RequestOptionsArgs): Observable<Response> {
    return this.intercept(super.patch(url, body, this.getRequestOptionArgs(url, options)));
  }

  public getRequestOptionArgs(url?: string, options?: RequestOptionsArgs): RequestOptionsArgs {
    if (options == null) {
      options = new RequestOptions();
    }

    if (options.headers == null) {
      options.headers = new Headers();
    }

    if (url) {
      if (!options.headers.get('Authorization')) {
        let token = '';
        if (url.indexOf(AppConstant.auth0.domain) !== -1) {
          options.headers.append('Accept', 'application/json');
          token = localStorage.getItem('access_token');
        } else if (url.indexOf(AppConstant.domain) !== -1) {
          options.headers.append('Content-Type', 'application/json');
          token = localStorage.getItem('id_token');
        }

        if (token) {
          options.headers.append('Authorization', 'Bearer ' + token);
        }
      }
    }

    return options;
  }

  public intercept(observable: Observable<Response>): Observable<Response> {
    let shareRequest = observable.share();
    this.showProgress();
    shareRequest.subscribe(
      () => {
        // subscribe
        this.hideProgress();
      },
      () => {
        // error
        this.hideProgress();
      },
      () => {
        // complete
        this.hideProgress();
      }
    );

    return shareRequest
      .catch((err, source) => {
        return Observable.throw(err);
      });
  }

  private showProgress() {
    this.progressService.start();
  }

  private hideProgress() {
    this.progressService.done();
  }
}
