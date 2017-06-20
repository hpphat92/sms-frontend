export class Subscriber {
  public mobile: string = '';
  public status: string = '';
  public account_id: string = '';
  public list_id: string  = '';
  public email: string = '';
  public name: string = '';
  public voice: string = '';
  public address1: string = '';
  public address2: string = '';
  public city: string = '';
  public state: string = '';
  public postal: string = '';
  public country: string = '';
  public language: string = '';
  public timezone: string = '';
  constructor( data?: any ) {
    let self = this;
    if (data) {
      self.mobile = data.mobile;
      self.status = data.status;
      self.account_id = data.account_id;
      self.list_id = data.list_id;
      self.email = data.email;
      self.name = data.name;
      self.voice = data.voice;
      self.address1 = data.address1;
      self.address2 = data.address2;
      self.city = data.city;
      self.state = data.state;
      self.postal = data.postal;
      self.language = data.language;
      self.country = data.country;
      self.timezone = data.timezone;
    }
  }

}

