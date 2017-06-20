import { AppConstant } from '../app.constant';

export class SubscriberListPagePost {
  public _id: string;
  public name: string = '';
  public description: string = '';
  public remote: boolean;
  public data_source_id: string = '';
  public account_id: string = '';
  public data?: any;

  constructor(data?: any) {
    let self = this;
    if (data) {
      self._id = data._id;
      self.name = data.name;
      self.description = data.description;
      self.remote = data.remote;
      self.data_source_id = data.data_source_id;
      self.account_id = data.account_id;
    }
  }
}

export interface SubscriberListTypeInterface {
  id: number;
  name: string;
}

export const SubscriberListTypes: SubscriberListTypeInterface[] = [
  {
    id: 1,
    name: 'Local'
  },
  {
    id: 2,
    name: 'Remote'
  }
];

export const SubscriberListTypeEnum = {
  LOCAL: 1,
  REMOTE: 2
};

export class SubscriberList {
  public _id: string;
  public name: string;
  public type: number;
  public data_source_id: string;
  public description: string;

  constructor(data?: SubscriberListPagePost) {
    if (data) {
      this._id = data._id;
      this.name = data.name;
      this.type = data.remote ? SubscriberListTypeEnum.REMOTE : SubscriberListTypeEnum.LOCAL;
      this.data_source_id = data.data_source_id;
      this.description = data.description;
    }
  }
}

export class SubscriberListFilter {
  public page: number = 1;
  public limit: number = 10;
  public sort: string;
  public search?: string;

  constructor(data) {
    this.page = data.page;
    this.limit = data.limit;
    this.sort = data.sort;
    this.search = data.search;
  }
}
