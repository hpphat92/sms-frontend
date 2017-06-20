import {
  Injectable
} from '@angular/core';

import * as moment from 'moment';

import {
  Http,
  Response,
  URLSearchParams
} from '@angular/http';

import {
  Observable
} from 'rxjs/Observable';

import { AppConstant } from '../app.constant';

import {
  ExtendedHttpService
} from '../shared/services/http';
import { UserContext } from '../shared/services/user-context/user-context';

@Injectable()
export class DashboardService {
  private _accountId: string;

  constructor(private http: ExtendedHttpService,
              private _userContext: UserContext) {

    this._accountId = this._userContext.currentUser.account_id || AppConstant.accountId;
    // empty
  }

  public getPrograms() {
    return this.http.get(`${AppConstant.domain}/programs`)
      .map(this.extractData)
      .catch(this.handleError)
      .toPromise();
  }

  public getBroadcastProgramsLast7Days() {
    let params = new URLSearchParams();
    params.set('type', 'broadcast');
    params.set('since', moment().subtract(7, 'day').format('YYYY-MM-DD'));
    return this.http.get(`${AppConstant.domain}/programs`, {
      search: params
    })
      .map(this.extractData)
      .catch(this.handleError)
      .toPromise();
  }

  public getRecentPrograms() {
    let params = new URLSearchParams();
    params.set('type', 'broadcast');
    params.set('status', 'completed');
    params.set('since', moment().subtract(7, 'day').format('YYYY-MM-DD'));
    return this.http.get(`${AppConstant.domain}/programs`, {
      search: params
    })
      .map(this.extractData)
      .catch(this.handleError)
      .toPromise();
  }

  public getCampaigns() {
    return this.http.get(`${AppConstant.domain}/campaigns`)
      .map(this.extractData)
      .catch(this.handleError)
      .toPromise();
  }

  public getImports() {
    let params = new URLSearchParams();
    params.set('since', moment().subtract(1, 'months').format('YYYY-MM-DD'));
    return this.http.get(`${AppConstant.domain}/imports`, {
      search: params
    })
      .map(this.extractData)
      .catch(this.handleError)
      .toPromise();
  }

  public getDailyStatistic() {

    return this.http.get(`${AppConstant.domain}/accounts/${this._accountId}/activity`)
      .map(this.extractData)
      .catch(this.handleError)
      .toPromise();
  }

  public getMonthToDateStatistic() {
    let params = new URLSearchParams();
    params.set('since', moment().subtract(1, 'months').format('YYYY-MM-DD'));
    return this.http.get(`${AppConstant.domain}/accounts/${this._accountId}/activity`, {
      search: params
    })
      .map(this.extractData)
      .catch(this.handleError)
      .toPromise();
  }

  public getMailingLists() {
    return this.http.get(`${AppConstant.domain}/lists`)
      .map(this.extractData)
      .catch(this.handleError)
      .toPromise();
  }

  public getKeywords() {
    return this.http.get(`${AppConstant.domain}/keywords`)
      .map(this.extractData)
      .catch(this.handleError)
      .toPromise();
  }

  private handleError(error: Response) {
    console.log('error', error);
    return Observable.throw(error.json());
  }

  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
}
