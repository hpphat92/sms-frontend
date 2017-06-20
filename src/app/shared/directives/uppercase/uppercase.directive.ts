import {
  Directive,
  HostListener,
  ChangeDetectorRef
} from '@angular/core';
import { DefaultValueAccessor } from '@angular/forms';

@Directive({
  selector: '[uppercase]'
})
export class UppercaseDirective extends DefaultValueAccessor {

  @HostListener('input', ['$event'])
  public InputHandler(event: any) {
    this.writeValue(event.target.value.toUpperCase());
  }

  public writeValue(value: any): void {
    if (value !== null) {
      super.writeValue(value.toUpperCase());
    }
  }
}
