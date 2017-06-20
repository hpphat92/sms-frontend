import {
  Component,
  ViewEncapsulation
} from '@angular/core';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'about-us',  // <privacy-policy></privacy-policy>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'about-us.template.html',
  styleUrls: [
    'about-us.style.scss'
  ]
})
export class AboutUsComponent {

}
