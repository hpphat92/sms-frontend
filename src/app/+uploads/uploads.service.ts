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

import { UserContext } from '../shared/services/user-context/user-context';

@Injectable()
export class UploadService {
  constructor(private _http: ExtendedHttpService,
              private _userContext: UserContext) {
  }

  /**
   * Import
   * @returns {Observable<R>}
   */
  public import(subscriberListId) {
    let objData = {
      list_id: subscriberListId,
      account_id: this._userContext.currentUser.account_id || AppConstant.accountId
    };

    return this._http.post(`${AppConstant.domain}/imports`, objData)
      .map((resp) => resp.json())
      .catch(this._handleError);
  }

  /**
   * Get subscriber list
   * @returns {Observable<R>}
   */
  public getSubscriberLists() {
    return this._http.get(`${AppConstant.domain}/lists`)
      .map((resp) => resp.json())
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
