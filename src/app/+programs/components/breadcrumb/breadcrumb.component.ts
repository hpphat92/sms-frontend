import {
  Component,
  ViewEncapsulation, OnInit, OnDestroy
} from '@angular/core';
import { ProgramsService } from '../../programs.service';
import { ActivatedRouteSnapshot, NavigationEnd, Router } from '@angular/router';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'program-breadcrumb',  // <dashboard-breadcrumb></dashboard-breadcrumb>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'breadcrumb.template.html',
  styleUrls: [
    'breadcrumb.style.scss'
  ]
})
export class ProgramBreadcrumbComponent implements OnInit, OnDestroy {

  public type = '';
  public action: '';

  private _subscription: any;

  constructor(public programService: ProgramsService,
              private router: Router) {

  }

  public ngOnInit(): void {
    this._subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        let data = this._getDeepestData(this.router.routerState.snapshot.root);
        if (data) {
          this.type = data.type;
          this.action = data.action;
        }
      }
    });
  }

  public ngOnDestroy(): void {
    if (this._subscription) {
      this._subscription.unsubscribe();
    }
  }

  private _getDeepestData(routeSnapshot: ActivatedRouteSnapshot) {
    let data = routeSnapshot.data ? routeSnapshot.data : null;
    if (routeSnapshot.firstChild) {
      data = this._getDeepestData(routeSnapshot.firstChild) || data;
    }
    return data;
  }
}
