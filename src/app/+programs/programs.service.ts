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
  ExtendedHttpService
} from '../shared/services';

@Injectable()
export class ProgramsService {

  public currentCampaign: any;
  constructor(private _http: ExtendedHttpService) {
  }

  /**
   * Get program list
   * @param data
   */
  public getList(data?: any): Observable<any[]> {

    let params = new URLSearchParams();

    if (data) {
      params.set('status', data.status);
      params.set('since', data.since);
      params.set('type', data.type);
      params.set('campaign_id', data.campaign_id);
      params.set('page', data.page);
      params.set('limit', data.limit);
      params.set('sort', data.sort);
      params.set('search', data.search);
    }

    return this._http
      .get(`${AppConstant.domain}/programs`, {search: params})
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Create program
   * @param data
   * @returns {Observable<R>}
   */
  public create(data): Observable<any> {
    let self = this;

    return self._http.post(`${AppConstant.domain}/programs`, data)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Update program
   * @param data
   * @returns {Observable<R>}
   */
  public update(data): Observable<any> {
    let self = this;

    return self._http.patch(`${AppConstant.domain}/programs/${data._id}`, data)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Remove program by id
   * @param id
   * @returns {Observable<R>}
   */
  public remove(id): Observable<any> {
    let self = this;

    return self._http.delete(`${AppConstant.domain}/programs/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Get program details by id
   * @param id
   * @returns {Observable<R>}
   */
  public getById(id): Observable<any> {
    return this._http.get(`${AppConstant.domain}/programs/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Get campaign details by id
   * @param id
   * @returns {Observable<R>}
   */
  public getDetailsCampaign(id): Observable<any> {
    return this._http.get(`${AppConstant.domain}/campaigns/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Get keyword available
   * @returns {Observable<R>}
   */
  public getKeywordAvailable(): Observable<any> {
    let params = new URLSearchParams();
    params.set('available', 'true');

    return this._http.get(`${AppConstant.domain}/keywords`, {search: params})
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Get subscriber list by id
   * @param id
   * @returns {Observable<R>}
   */
  public getSubscriberListById(id): Observable<any> {
    return this._http.get(`${AppConstant.domain}/lists/${id}`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Get keyword available
   * @returns {Observable<R>}
   */
  public getCampaigns(): Observable<any> {

    return this._http.get(`${AppConstant.domain}/campaigns`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Get short code list
   * @returns {Observable<R>}
   */
  public getShortCodes(): Observable<any> {

    return this._http.get(`${AppConstant.domain}/codes`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Get all templates
   * @returns {Observable<R>}
   */
  public getTemplates(): Observable<any> {

    return this._http.get(`${AppConstant.domain}/templates`)
      .map((response) => response.json())
      .catch(this._handleError);
  }

  /**
   * Error handler for observable
   * @param error
   * @returns {any}
   * @private
   */
  private _handleError(error: Response) {
    return Observable.throw(error.json());
  }
}
