import {
  Component, OnDestroy, OnInit,
  ViewEncapsulation
} from '@angular/core';
import { AppConstant } from '../../../app.constant';
import { ConfirmService } from '../../modules/confirm-change/confirm-change.service';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'main-layout-container',  // <main-layout-container></main-layout-container>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: './main-layout-container.template.html',
  styleUrls: [
    './main-layout-container.style.scss'
  ]
})
export class MainLayoutComponent implements OnInit, OnDestroy {

  private _idleTimeout: number = AppConstant.idleTimeout; // 30 minutes

  private _subscriptionIdle: any;

  constructor(private router: Router,
              private _idle: Idle,
              private _confirmService: ConfirmService,
              private _authService: AuthService) {

  }

  public idle() {
    // sets an idle timeout of _idleTimeout seconds, for testing purposes.
    this._idle.setIdle(1);

    // sets a timeout period of 5 seconds. after _idleTimeout seconds of inactivity, the user will be considered timed out.
    this._idle.setTimeout(this._idleTimeout);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this._idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // When end of timeout then show dialog confirm
    this._subscriptionIdle = this._idle.onTimeout.subscribe(() => {
      console.log('timeout');

      this._confirmService.show('', (action) => {
        if (action === 'OK') {
          this._authService.logout();

          this.router.navigate(['auth', 'sign-in']);
        } else {
          // Restart idle
          this.reset();
        }
      }, false, undefined, 'OK', 'CANCEL', false, true);
    });

    // Start idle
    this.reset();
  }

  public reset() {
    this._idle.watch();
  }

  public ngOnDestroy() {
    if (this._subscriptionIdle) {
      this._subscriptionIdle.complete();
    }
  }

  public ngOnInit(): void {
    this.idle();
  }
}
