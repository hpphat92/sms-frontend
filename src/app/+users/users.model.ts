import { AppConstant } from '../app.constant';

export class UserModel {
  public _id: string;
  public account_id: string = '';
  public email: string = '';
  public password: string = '';
  public role: string = '';
  public firstName: string = '';
  public lastName: string = '';
  public phoneNumber: string = '';
  public timezone: string = '';
  public photoUrl: string = '';
  public confirm: string = '';

  constructor(data: any = {}) {
    if (data) {
      this._id = data._id;
      this.email = data.email;
      this.password = data.password;
      this.role = data.role;
      this.firstName = data.firstName;
      this.lastName = data.lastName;
      this.photoUrl = data.photoUrl;
      this.timezone = data.timezone;
      this.phoneNumber = data.phoneNumber;
      this.confirm = data.confirm;
      this.account_id = data.account_id;
    }
  }
}

export const RoleList: string[] = [
  'administrator',
  'manager',
  'associate'
];

export class UserFilter {
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
