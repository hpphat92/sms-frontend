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
import { UserContext } from '../shared/services/user-context/user-context';

@Injectable()
export class KeywordService extends BehaviorSubject<any[]> {
  private data: any[] = [];

  private _subscription: any;

  private _accountId: string;

  constructor(private _http: ExtendedHttpService,
              private _userContext: UserContext) {
    super([]);

    this._accountId = this._userContext.currentUser.account_id || AppConstant.accountId;
  }

  /**
   * Get keyword list
   * @param filter
   */
  public getList(page: number, limit: number, sort?: string, filter?: string) {
    let params = new URLSearchParams();
    params.set('page', page.toLocaleString());
    params.set('limit', limit.toString());
    params.set('sort', sort);
    params.set('search', filter);

    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this._subscription = this._fetch(params)
      .do((data) => this.data = data)
      .subscribe((data) => {
        super.next(data);
      });
  }

  /**
   * Release keyword
   * @param data
   * @returns {Observable<R>}
   */
  public release(data): Observable<any> {
    let self = this;
    let params = new URLSearchParams();
    params.set('account_id', this._accountId);
    params.set('code_id', data.codes[0].code_id);
    return self._http.delete(
      `${AppConstant.domain}/keywords/${data._id}`, {
        search: params
      })
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Reserve keyword
   * @param data
   * @returns {Observable<R>}
   */
  public reserve(data): Observable<any> {
    let self = this;

    return self._http.post(`${AppConstant.domain}/keywords/${data.keyword}`, {
      code_id: data.shortcode,
      account_id: this._accountId
    })
      .map((response) => response.json())
      .catch(this._handleError);
  }

  public getCodes(): Observable<any> {
    let self = this;
    return self._http.get(`${AppConstant.domain}/codes`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  public getKeywordById(id): Observable<any> {
    let self = this;

    return self._http.get(`${AppConstant.domain}/keywords/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Remove keyword
   * @param data
   * @returns {Observable<R>}
   */
  public remove(data): Observable<any> {
    let self = this;

    let params = new URLSearchParams();
    params.set('account_id', this._accountId);
    params.set('code_id', data.codes[0].code_id);
    params.set('remove', 'true');
    return self._http.delete(
      `${AppConstant.domain}/keywords/${data._id}`, {
        search: params
      })
      .map((response) => response.json())
      .catch(this._handleError);
  }

  private _fetch(params: URLSearchParams): Observable<any[]> {
    return this._http
      .get(`${AppConstant.domain}/keywords`, {
        search: params
      })
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
