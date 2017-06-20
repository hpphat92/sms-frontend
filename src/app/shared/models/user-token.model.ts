export class UserToken {
  public accessToken: string;
  public refreshToken: string;

  constructor() {
    this.accessToken = undefined;
    this.refreshToken = undefined;
  }
}
