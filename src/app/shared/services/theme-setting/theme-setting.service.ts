import {
  Injectable,
  EventEmitter
} from '@angular/core';

@Injectable()
export class ThemeSetting {
  // Constants
  public sidebarWidth: number = 280;

  public get sideBarWidthCondensed(): number {
    return this.sidebarWidth - 70;
  };

  public themeChanged = new EventEmitter<string>();

  public bodyEl;

  public set pageClassList(value: string[]) {
    this._pageClassList = value;
    this._themeChanged();
  }

  private _pageClassList: string[] = [];

  private classList = [];

  private _sidebarOpen: boolean = false;
  private _mobileNavOpen: boolean = false;
  private _menuPin: boolean = false;
  private _sidebarHover: boolean = false;
  private _pageLoaded: boolean = false;

  public init(bodyElement) {
    this.bodyEl = bodyElement;
  }

  private addOrRemoveClass(className: string, isAdd: boolean) {
    if (isAdd) {
      this.classList.push(className);
    } else {
      for (let cl of this.classList) {
        let idx = this.classList.indexOf(className);
        if (idx > -1) {
          this.classList.splice(idx, 1);
        }
      }
    }
  }

  private _themeChanged(): void {
    let classes = [
      'fixed-header',
      'boxed',
      ...this.classList,
      ...this._pageClassList
    ];

    this.bodyEl.className = classes.join(' ');

    this.themeChanged.emit('changed');
  }

  // private _menuBehind: boolean = false;
  // get menuBehind(): boolean {
  //   return this._menuBehind;
  // }
  //
  // set menuBehind(value) {
  //   this._menuBehind = value;
  //   this.addOrRemoveClass('menu-behind', value);
  //   this._themeChanged();
  // }

  get sidebarOpen(): boolean {
    return this._sidebarOpen;
  }

  set sidebarOpen(value) {
    this._sidebarOpen = value;
    this.addOrRemoveClass('sidebar-open', value);
    this._themeChanged();
  }

  get mobileNavOpen(): boolean {
    return this._mobileNavOpen;
  }

  set mobileNavOpen(value) {
    this._mobileNavOpen = value;
    this.addOrRemoveClass('ms-navigation-horizontal-mobile-menu-active', value);
    this._themeChanged();
  }

  // private _layoutBoxed: boolean = false;
  // get layoutBoxed(): boolean {
  //   return this._layoutBoxed;
  // }
  //
  // set layoutBoxed(value) {
  //   this._layoutBoxed = value;
  //   this._themeChanged();
  // }
  //
  get menuPin(): boolean {
    return this._menuPin;
  }

  set menuPin(value) {
    this._menuPin = value;
    this.addOrRemoveClass('menu-pin', value);
    this._themeChanged();
  }

  // private _noHeader: boolean = false;
  // get noHeader(): boolean {
  //   return this._noHeader;
  // }
  //
  // set noHeader(value) {
  //   this._noHeader = value;
  //   this._themeChanged();
  // }
  //
  // private _bgMasterLighter: boolean = false;
  // get bgMasterLighter(): boolean {
  //   return this._bgMasterLighter;
  // }
  //
  // set bgMasterLighter(value) {
  //   this._bgMasterLighter = value;
  //   this._themeChanged();
  // }
  //
  // private _horizontal: boolean = false;
  // get horizontal(): boolean {
  //   return this._horizontal;
  // }
  //
  // set horizontal(value) {
  //   this._horizontal = value;
  //   this._themeChanged();
  // }
  //
  // private _rtl: boolean = false;
  // get rtl(): boolean {
  //   return this._rtl;
  // }
  //
  // set rtl(value) {
  //   this._rtl = value;
  //   this._themeChanged();
  // }

  get sidebarHover(): boolean {
    return this._sidebarHover;
  }

  set sidebarHover(value) {
    this._sidebarHover = value;
    this.addOrRemoveClass('sidebar-visible', value);
    this._themeChanged();
  }

  get pageLoaded(): boolean {
    return this._pageLoaded;
  }

  set pageLoaded(value) {
    this._pageLoaded = value;
    this.addOrRemoveClass('loaded', value);
    this._themeChanged();
  }

  // constructor() {
  // }
}
