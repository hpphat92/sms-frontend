import {
  Component,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'back-button',
  templateUrl: 'back-button.template.html',
  encapsulation: ViewEncapsulation.None,
})
export class BackButtonComponent {

  public back(): void {
    window.history.back();
  }
}
