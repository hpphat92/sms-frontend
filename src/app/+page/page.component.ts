import {
  Component,
  ViewEncapsulation
} from '@angular/core';
import {
  NavigationStart,
  NavigationEnd
} from '@angular/router';
import {
  Router
} from '@angular/router';
@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'page',  // <page></page>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'page.template.html',
  styleUrls: [
    'page.style.scss'
  ]
})
export class PageComponent {
  public currentUrl;
  constructor(public router: Router) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.currentUrl = event.urlAfterRedirects;
      } else if (event instanceof NavigationStart) {
        this.currentUrl = event.url;
      }
    });
  }

}
