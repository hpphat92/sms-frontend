import * as _ from 'lodash';

import {
  Component,
  ViewEncapsulation,
  Input
} from '@angular/core';

import {
  Router,
  ActivatedRoute,
  NavigationEnd, NavigationStart
} from '@angular/router';

import {
  Sidebar
} from 'ng-sidebar';

import {
  AuthService,
  Util,
  ThemeSetting,
  UserContext
} from '../../../../services';
import { RouterService } from '../../../../../core/router/router.service';

// import {
//   TranslationModel,
//   Translation
// } from "../../../../modules/i18n";

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'page-header',  // <page-header></page-header>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './page-header.template.html',
  styleUrls: [
    './page-header.style.scss'
  ]
})
export class PageHeaderComponent {
  @Input()
  public sidenav: Sidebar;

  // public translations: TranslationModel[] = [];
  // public currentTranslation: TranslationModel;

  public menus: any[] = [
    {
      name: 'HOME',
      isActive: false,
      subMenus: [
        {
          name: 'DASHBOARD',
          link: '/dashboard',
          isActive: false
        },
        {
          name: 'SUBSCRIBER LISTS',
          link: '/subscriber-list',
          isActive: false
        },
        {
          name: 'FILE UPLOAD',
          link: '/uploads',
          isActive: false
        },
        {
          name: 'REPORTS',
          isActive: false
        },
        {
          name: 'GLOBAL VARIABLES',
          isActive: false
        }
      ]
    },
    {
      name: 'TEXT MESSAGING',
      isActive: false,
      subMenus: [
        {
          name: 'CAMPAIGNS',
          link: '/campaigns',
          isActive: false
        },
        {
          name: 'KEYWORDS',
          link: '/keywords',
          isActive: false
        },
        {
          name: 'TEMPLATES',
          link: '/message-templates',
          isActive: false
        },
        {
          name: 'OPT-IN FORMS',
          isActive: false
        },
        {
          name: 'ATTACHMENTS',
          isActive: false
        }
      ]
    },
    {
      name: 'MOBILE WEB',
      isActive: false
    },
    // {
    //   name: 'Support',
    //   isActive: false
    // }
  ];

  public enableBack: boolean;
  public previousPath: string;

  constructor(private _router: Router,
              private _authService: AuthService,
              private _themeSetting: ThemeSetting,
              public userContext: UserContext,
              private activatedRoute: ActivatedRoute,
              private _util: Util,
              private _routerService: RouterService
              /*private _translation: Translation*/) {
    // this.translations = this._translation.getTranslations();

    // this.currentTranslation = this._translation.getCurrentTranslation();

    this._initMenu(this.menus, null);

    this._router.events.subscribe((event: any) => {

      if (event instanceof NavigationEnd) {
        let lastActivatedRoute = this._util.getLastActivatedRoute(this.activatedRoute);
        let keyPath = this._util.getFullRoutePathByActivatedRoute('', lastActivatedRoute);

        // Check if last view cached then visible back button
        if (this.previousPath) {
          this.enableBack = _.has(this._routerService.storedRoutes, this.previousPath);
        }
        this.previousPath = keyPath;

        keyPath = keyPath.substring(0, keyPath.length - 1); // remove last slash '/' in the path
        let menu = this._deepFindLink(keyPath, this.menus);
        this._clearActiveStatus(this.menus);
        this._activeMenu(menu);
      }
    });
  }

  // Clear active status of all menu
  private _clearActiveStatus(menus) {
    _.forEach(menus, (menu) => {
      menu.isActive = false;
      if (menu.subMenus && menu.subMenus.length > 0) {
        this._clearActiveStatus(menu.subMenus);
      }
    });
  }

  // active current menu and it's parent
  private _activeMenu(menu) {
    if (menu) {
      menu.isActive = true;
      if (menu.__parent) {
        this._activeMenu(menu.__parent);
      }
    }
  }

  // Init menu parent-child relation
  private _initMenu(menus, lastParent) {
    _.forEach(menus, (menu) => {
      if (lastParent) {
        menu.__parent = lastParent;
      }
      if (menu.subMenus && menu.subMenus.length > 0) {
        this._initMenu(menu.subMenus, menu);
      }
    });
  }

  // Deep find nested object by link
  private _deepFindLink(link: string, menus: any[]) {
    for (let i = 0; i < menus.length; i++) {
      let menu = menus[i];
      // if (menu.link === link) {
      if (link.indexOf(menu.link) > -1) {
        return menu;
      }

      if (menu.subMenus && menu.subMenus.length > 0) {
        let result = this._deepFindLink(link, menu.subMenus);
        if (result) {
          return result;
        }
      }
    }
    return null;
  }

  // public changeTranslation(trans) {
  //   this.currentTranslation = trans;
  //   this._translation.use(trans);
  // }

  public expandMenu(menu) {
    menu.expanded = !menu.expanded;
  }

  public isAdministratorOrManager() {
    return this._authService.isRole('administrator') || this._authService.isRole('manager');
  }

  public toggleMobileSideNav() {
    this._themeSetting.mobileNavOpen = !this._themeSetting.mobileNavOpen;
  }

  public logout() {
    this._authService.logout();

    this._router.navigate(['auth', 'sign-in']);
  }
}
