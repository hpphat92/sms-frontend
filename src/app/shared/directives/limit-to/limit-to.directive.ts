import {
  Directive,
  Input,
  HostListener
} from '@angular/core';

@Directive({
  selector: '[limit-to]'
})
export class LimitToDirective {
  @Input('limit-to')
  public limitTo;

  @Input() set control(control) {
    if (!control || !control.valueChanges) {
      return;
    }

    // Watch control value change to update value with limit To
    control.valueChanges.subscribe((value) => {
      if (value.length > this.limitTo) {
        control.patchValue(value.substr(0, this.limitTo));
      }
    });
  }

  @HostListener('window:keydown', ['$event'])
  public keyboardInput(event: any) {
    let length = parseFloat(this.limitTo);

    // Prevent default by value > limit length
    if (event.target.value.length >= length && event.keyCode !== 8) {
      event.preventDefault();
    }
  }
}
