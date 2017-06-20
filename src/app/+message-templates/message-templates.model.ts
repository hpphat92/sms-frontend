export class MessageTemplate {
  public _id: string;
  public name: string = '';
  public content: string = '';
  public account_id: string = '';

  constructor(data?: any) {
    if (data) {
      this._id = data._id;
      this.name = data.name;
      this.content = data.content;
      this.account_id = data.account_id;
    }
  }
}

export class MessageTemplateFilter {
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
