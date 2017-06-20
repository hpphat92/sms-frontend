import {
  Injectable
} from '@angular/core';

import {
  Response,
} from '@angular/http';

import {
  Observable
} from 'rxjs/Observable';

import { AppConstant } from './../../../app.constant';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import {
  ExtendedHttpService
} from '../../../shared/services/http';

@Injectable()
export class SubscriberService extends BehaviorSubject<any[]> {
  private data: any[] = [];

  constructor(private _http: ExtendedHttpService) {
    super([]);
  }

  public create(data): Observable<any> {
    let self = this;

    return self._http.post(`${AppConstant.domain}/subscribers`, data)
      .map((response) => response.json())
      .catch(this.handleError);
  }
  private handleError(error: Response) {
    return Observable.throw(error.json());
  }
}
