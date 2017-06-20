import { BaseModel } from './base.model';

export class UserInfo extends BaseModel {
  public name?: string;
  public email?: string;
  public nickname?: string;
  public picture?: string;
  public phoneNumber?: string;
  public role?: string;
  public account_id: string;

  constructor() {
    super();
    this.id = undefined;
    this.name = undefined;
    this.email = undefined;
    this.phoneNumber = undefined;
    this.nickname = undefined;
    this.picture = undefined;
    this.role = undefined;
    this.account_id = undefined;
  }
}
