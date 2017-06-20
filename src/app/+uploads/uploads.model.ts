export class UploadModel {
  public _id: number;

  constructor(data: any = null) {
    if (data) {
      this._id = data._id;
    }
  }
}
