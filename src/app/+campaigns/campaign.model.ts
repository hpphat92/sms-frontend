export class CampaignModel {
  public _id: number;
  public name: string = '';
  public description: string = '';
  public help_msg: string = '';
  public stop_msg: string = '';
  public account_id: string = '';
  public list_id?: string;

  constructor(data: any = null) {
    if (data) {
      this._id = data._id;
      this.name = data.name;
      this.description = data.description;
      this.help_msg = data.help_msg;
      this.stop_msg = data.stop_msg;
      this.account_id = data.account_id;

      if (data.list_id !== 'New') {
        this.list_id = data.list_id;
      }
    }
  }
}
