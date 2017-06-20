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

@Injectable()
export class CampaignService extends BehaviorSubject<any[]> {
  private data: any[] = [];

  private _subscription: any;

  constructor(private _http: ExtendedHttpService) {
    super([]);
  }

  /**
   * Get campaign list
   * @param filter
   */
  public getList(page: number, limit: number, sort?: string, search?: string) {
    let params = new URLSearchParams();
    params.set('page', page.toLocaleString());
    params.set('limit', limit.toString());
    params.set('sort', sort);
    params.set('search', search);

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
   * Create campaign
   * @param data
   * @returns {Observable<R>}
   */
  public create(data): Observable<any> {
    let self = this;

    return self._http.post(`${AppConstant.domain}/campaigns`, data)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Update campaign
   * @param data
   * @returns {Observable<R>}
   */
  public update(data): Observable<any> {
    let self = this;

    return self._http.patch(`${AppConstant.domain}/campaigns/${data._id}`, data)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Archive campaign by id
   * @param id
   * @returns {Observable<R>}
   */
  public archive(id): Observable<any> {
    let self = this;

    return self._http.delete(`${AppConstant.domain}/campaigns/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Get campaign details by id
   * @param id
   * @returns {Observable<R>}
   */
  public getById(id): Observable<any> {
    return this._http.get(`${AppConstant.domain}/campaigns/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  public getSubscriberList(): Observable<any> {
    return this._http
      .get(`${AppConstant.domain}/lists`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  public getSubscriberListDetail(id): Observable<any> {
    let self = this;

    return self._http.get(`${AppConstant.domain}/lists/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  private _fetch(params: URLSearchParams): Observable<any[]> {
    return this._http
      .get(`${AppConstant.domain}/campaigns`, {
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
