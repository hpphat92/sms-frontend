import {
  Injectable
} from '@angular/core';

export interface RouterOptions {
  enableBackView: boolean;
  pageYOffset?: number;
  elemScroll?: string;
}

@Injectable()
export class RouterService {
  private _enableBackView: boolean = false;
  private _pageYOffset: number = 0;
  private _storedRoutes: any;

  public set(options: RouterOptions) {
    this.enableBackView = options.enableBackView;
    this.pageYOffset = options.pageYOffset;
    // auto fill pageYOffset if undefined

    if (this.enableBackView && typeof this.pageYOffset === 'undefined') {
      this.pageYOffset = options.elemScroll ?
        document.querySelector(options.elemScroll).scrollTop : window.pageYOffset;
    }
  }

  get enableBackView() {
    return this._enableBackView;
  }

  set enableBackView(value) {
    this._enableBackView = value;
  }

  get storedRoutes() {
    return this._storedRoutes;
  }

  set storedRoutes(value) {
    this._storedRoutes = value;
  }

  get pageYOffset() {
    return this._pageYOffset;
  }

  set pageYOffset(value) {
    this._pageYOffset = value;
  }
}
