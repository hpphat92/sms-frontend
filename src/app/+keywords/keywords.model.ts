import { AppConstant } from '../app.constant';

export class ReserveKeywordModel {
  public _id: number;
  public shortcode: string = '';
  public keyword: string = '';
  public confirm: string = '';

  constructor(data: any = null) {
    if (data) {
      this._id = data._id;
      this.shortcode = data.shortcode;
      this.keyword = data.keyword.toUpperCase();
      this.confirm = data.confirm;
    }
  }
}
