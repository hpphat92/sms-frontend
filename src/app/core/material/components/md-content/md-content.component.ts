import { Component, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'md-content',
  template: `
    <ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None
})
export class MdContentComponent {
}
