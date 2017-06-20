import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../shared/services';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in self case, selector is the string 'home'
  selector: 'authorize',  // <sign-in></sign-in>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'authorize.template.html',
  styleUrls: [
    'authorize.style.scss'
  ]
})
export class AuthorizeComponent {
  constructor(private _authService: AuthService,
              private _router: Router) {
    if (!_authService.isAuthenticated()) {
      _router.navigate(['auth', 'sign-in']);
    }else{
      _router.navigate(['dashboard']);
    }
  }
}
