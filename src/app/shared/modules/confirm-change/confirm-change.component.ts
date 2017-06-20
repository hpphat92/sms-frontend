import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AppConstant } from '../../../app.constant';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'confirm-change',
  template: `
    <div class="text-center p-16">
      <div [innerHtml]="message" class="confirm-message" *ngIf="type !== 'countdown'"></div>
      <div *ngIf="type === 'countdown'">
        You have no activities during {{idleTimeout / 60}} minutes. Do you want to sign out? <br>
        Count down : {{countDown | amFromUnix | amDateFormat: 'mm:ss'}}
      </div>

      <p class="warning-text" *ngIf="isDelete">WARNING: THIS ACTION IS PERMANENT</p>
    </div>
  `,
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['confirm-change.style.scss']
})
export class ConfirmChangeComponent implements OnInit, OnDestroy {
  public forceTime = 180000;
  public countDown = Math.floor(this.forceTime / 1000);

  public idleTimeout = AppConstant.idleTimeout;

  public _countDownSubscription: any;

  @Input()
  public message: any;

  @Input()
  public isDelete: boolean = false;

  @Input()
  public type: string = 'confirm';

  @Input()
  public modalInstance;

  public ngOnInit(): void {
    if (this.type === 'countdown') {
      this._countDownSubscription = Observable.interval(1000)
        .subscribe((x) => {
          this.countDown = this.countDown - 1;

          if (this.countDown <= 0 && this.modalInstance) {
            this.modalInstance.close({text: 'OK'});
          }
        });
    }
  }

  public ngOnDestroy(): void {
    if (this._countDownSubscription) {
      this._countDownSubscription.unsubscribe();
    }
  }
}

