import {
  Component,
  ViewEncapsulation,
  OnInit,
  HostBinding
} from '@angular/core';

import {
  FormBuilder,
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

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'sign-in',  // <sign-in></sign-in>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'sign-in.template.html',
  styleUrls: [
    'signin.style.scss'
  ],
  animations: [bottomToTopFadeAnimation()]
})
export class SignInComponent implements OnInit {
  public frm: FormGroup;
  public formErrors = {
    email: '',
    password: ''
  };
  public validationMessages = {
    email: {
      required: 'Email is required.',
      email: 'Email is invalid.'
    },
    password: {
      required: 'Password is required.',
      minlength: 'Password must be at least 8 characters long.',
      pattern: 'Password must contain at least 1 Capital letter and at least 1 Number'
    }
  };
  public hasError: boolean = false;
  public submitted: boolean = false;

  constructor(private _router: Router,
              private _fb: FormBuilder,
              private _authService: AuthService,
              private _toast: ToastrService) {

  }

  public ngOnInit(): void {
    this.buildForm();
  }

  public buildForm() {
    this.frm = this._fb.group({
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        // Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d$@$!%*#?&^_\\-\\(\\)\\+]+$')
      ]),
      remember: new FormControl(true)
    });

    this.frm.valueChanges
      .subscribe((data) => this.onValueChanged(data));

    this.onValueChanged(); // (re)set validation messages now
  }

  public onValueChanged(data?: any) {
    if (!this.frm) {
      return;
    }
    const form = this.frm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
              break;
            }
          }
        }
      }
    }
  }

  public signUp() {
    this._router.navigate(['auth', 'sign-up']);
  }

  public onSubmit(value: any) {
    this.hasError = false;
    this.submitted = true;
    this._authService.login(value.email, value.password, (err) => {
      if (err) {
        this.hasError = true;
        this.submitted = false;
        if (err.statusCode === 404) {
          this._toast.error('User not found!', 'Error');
        } else {
          this._toast.error(err.description, 'Error');
        }
      }
    });
  }
}
