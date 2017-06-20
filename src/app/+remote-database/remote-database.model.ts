export class RemoteDatabaseFilter {
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

export class RemoteDatabasePost {
  public _id: string;
  public account_id: string = '';
  public name: string = '';
  public user: string = '';
  public host: string = '';
  public port: string = '';
  public description: string = '';
  public password: string = '';
  public driver: string = '';
  public ssl: boolean;
  public database: string = '';

  constructor(data?: any) {
    let self = this;
    if (data) {
      self._id = data._id;
      self.name = data.name;
      self.account_id = data.account_id;
      self.user = data.user;
      self.host = data.host;
      self.port = data.port;
      self.description = data.description;
      self.password = data.password;
      self.driver = data.driver;
      self.database = data.database;
      self.ssl = data.ssl;
    }
  }
}
