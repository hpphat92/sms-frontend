import {
  Component,
  ViewEncapsulation,
} from '@angular/core';

import {
  Router
} from '@angular/router';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'page-footer',  // <page-footer></page-footer>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'page-footer.template.html',
  styleUrls: [
    'page-footer.style.scss'
  ],
})
export class PageFooterComponent  {
}
