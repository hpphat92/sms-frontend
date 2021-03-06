import {
  Component,
  ViewEncapsulation
} from '@angular/core';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'subscriber-list-breadcrumb',  // <dashboard-breadcrumb></dashboard-breadcrumb>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'breadcrumb.template.html',
  styleUrls: [
    'breadcrumb.style.scss'
  ]
})
export class SubscriberListBreadcrumbComponent {

}
