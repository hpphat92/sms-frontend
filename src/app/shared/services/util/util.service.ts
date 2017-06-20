import {
  Injectable
} from '@angular/core';

import {
  ActivatedRouteSnapshot,
  ActivatedRoute
} from '@angular/router';

@Injectable()
export class Util {

  public getFullRoutePath(suffix, route: ActivatedRouteSnapshot) {
    if (route.routeConfig && route.routeConfig.path) { // If the path not empty
      suffix = `${route.routeConfig.path}/${suffix}`;
    }
    if (route.parent) { // If it still has parent
      return this.getFullRoutePath(suffix, route.parent);
    }
    return '/' + suffix;
  }

  public getFullRoutePathByActivatedRoute(suffix, route: ActivatedRoute) {
    if (route.routeConfig && route.routeConfig.path) { // If the path not empty
      suffix = `${route.routeConfig.path}/${suffix}`;
    }
    if (route.parent) { // If it still has parent
      return this.getFullRoutePathByActivatedRoute(suffix, route.parent);
    }
    return '/' + suffix;
  }

  public getLastActivatedRoute(route: ActivatedRoute) {
    while (route.firstChild) {
      route = route.firstChild;
    }

    return route;
  }

  /**
   * @param {int} The month number, 0 based
   * @param {int} The year, not zero based, required to account for leap years
   * @return {Date[]} List with date objects for each day of the month
   */
  public getDaysInCurrentMonth() {
    let year = new Date().getFullYear();
    let month = new Date().getMonth() + 1;
    let maxDate = new Date(year, month, 0).getDate();
    let days = [];
    let i = 1;
    while (i <= maxDate) {
      days.push(i);
      i++;
    }
    return days;
  }
}
