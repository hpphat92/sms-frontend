import {
  Injectable
} from '@angular/core';

import {
  Http,
  Response,
  URLSearchParams
} from '@angular/http';

import {
  Observable
} from 'rxjs/Observable';

import { AppConstant } from '../app.constant';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  ExtendedHttpService
} from '../shared/services/http';

@Injectable()
export class SubscriberListsService extends BehaviorSubject<any[]> {
  private data: any[] = [];

  private _subscription: any;

  constructor(private _http: ExtendedHttpService) {
    super([]);
  }

  public getSubscriberList(filter?: any) {

    if (this._subscription) {
      this._subscription.unsubscribe();
    }

    this._subscription = this.fetch(filter)
      .do((data) => this.data = data)
      .subscribe((data) => {
        super.next(data);
      });
  }

  public getSource(): Observable<any[]> {
    let self = this;
    return self._http.get(`${AppConstant.domain}/sources`)
      .map((response) => response.json())
      .catch(this.handleError);
  }

  public create(data): Observable<any> {
    let self = this;

    return self._http.post(`${AppConstant.domain}/lists`, data)
      .map((response) => response.json())
      .catch(this.handleError);
  }

  public update(data): Observable<any> {
    let self = this;

    return self._http.patch(`${AppConstant.domain}/lists/${data._id}`, data)
      .map((response) => response.json())
      .catch(this.handleError);
  }

  public remove(id): Observable<any> {
    let self = this;

    return self._http.delete(`${AppConstant.domain}/lists/${id}`)
      .map((response) => response.json())
      .catch(this.handleError);
  }

  public getDetail(id): Observable<any> {
    let self = this;

    return self._http.get(`${AppConstant.domain}/lists/${id}`)
      .map((response) => response.json())
      .catch(this.handleError);
  }

  private fetch(data?: any): Observable<any[]> {
    let params = new URLSearchParams();

    if (data) {
      params.set('page', data.page);
      params.set('limit', data.limit);
      params.set('sort', data.sort);
      params.set('search', data.search);
    }

    return this._http
      .get(`${AppConstant.domain}/lists`, {search: params})
      .map((response) => response.json())
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    return Observable.throw(error.json());
  }
}
