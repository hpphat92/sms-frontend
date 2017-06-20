import {
  Component,
  ViewEncapsulation,
  OnInit
} from '@angular/core';

import {
  Validators,
  FormGroup,
  FormControl
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  AuthService
} from '../shared/services/auth';
import {
  bottomToTopFadeAnimation
} from '../shared/animations';

import { ToastrService } from 'ngx-toastr';
import { ValidationService } from '../shared/services/validation/validation.service';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'forgot-password',  // <sign-in></sign-in>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'forgot-password.template.html',
  styleUrls: [
    'forgot-password.style.scss'
  ],
  animations: [bottomToTopFadeAnimation()],
  providers: [
    ValidationService
  ]
})
export class ForgotPasswordComponent implements OnInit {
  public frm: FormGroup;
  public formErrors = {
    email: '',
  };
  public validationMessages = {
    email: {
      required: 'Email is required.',
      email: 'Email is invalid.'
    }
  };

  public controlConfig = {
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  };

  public hasError: boolean = false;
  public submitted: boolean = false;

  constructor(private _authService: AuthService,
              private _toast: ToastrService,
              private _validationService: ValidationService,
              private _router: Router) {

  }

  public ngOnInit(): void {
    this.frm = this._validationService.buildForm(
      this.controlConfig, this.formErrors, this.validationMessages);
  }

  public onSubmit(value: any) {
    this.hasError = false;
    this.submitted = true;
    this._authService.forgot(value.email, (err, resp) => {
      if (err) {
        this.hasError = true;
        this.submitted = false;
        if (err.statusCode === 404) {
          this._toast.error('User not found!', 'Error');
        } else {
          this._toast.error(err.description, 'Error');
        }
      } else {
        this._toast.success(resp, 'Success');
        this._router.navigate(['auth', 'sign-in']);
      }
    });
  }
}
