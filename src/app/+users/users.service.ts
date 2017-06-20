import {
  Injectable
} from '@angular/core';

import {
  Response,
  URLSearchParams
} from '@angular/http';

import {
  Observable
} from 'rxjs/Observable';

import {
  AppConstant
} from '../app.constant';

import {
  BehaviorSubject
} from 'rxjs/BehaviorSubject';

import {
  ExtendedHttpService
} from '../shared/services';

import {
  ToastrService
} from 'ngx-toastr';

@Injectable()
export class UserService extends BehaviorSubject<any[]> {
  private data: any[] = [];

  private _subscription: any;

  constructor(private _http: ExtendedHttpService) {
    super([]);
  }

  /**
   * Get user list
   * @param filter
   */
  public getList(filter?: any) {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this._subscription = this._fetch(filter)
      .do((data) => this.data = data)
      // .catch((err) => {
      //   if (err.message) {
      //     this._toaster.error('Error', err.message);
      //   }
      //   return Observable.empty<any[]>();
      // })
      .subscribe((data) => {
        super.next(data);
      });
  }

  /**
   * Create user
   * @param data
   * @returns {Observable<R>}
   */
  public create(data): Observable<any> {
    let self = this;

    return self._http.post(`${AppConstant.domain}/users`, data)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Update user
   * @param id
   * @param data
   * @returns {Observable<R>}
   */
  public update(data): Observable<any> {
    let self = this;

    return self._http.patch(`${AppConstant.domain}/users/${data._id}`, data)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Remove user by id
   * @param id
   * @returns {Observable<R>}
   */
  public remove(id): Observable<any> {
    let self = this;

    return self._http.delete(`${AppConstant.domain}/users/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Get user details by id
   * @param id
   * @returns {Observable<R>}
   */
  public getById(id): Observable<any> {
    return this._http.get(`${AppConstant.domain}/users/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  private _fetch(data?: any): Observable<any[]> {
    let params = new URLSearchParams();
    if (data) {
      params.set('page', data.page);
      params.set('limit', data.limit);
      params.set('sort', data.sort);
      params.set('search', data.search);
    }
    return this._http
      .get(`${AppConstant.domain}/users`, {search: params})
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Error handler for obserable
   * @param error
   * @returns {any}
   * @private
   */
  private _handleError(error: Response) {
    return Observable.throw(error.json());
  }
}
