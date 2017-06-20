import { Component, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'mat-menu-divider',
  template: `
    <ng-content></ng-content>`,
  encapsulation: ViewEncapsulation.None,
  styles: [
      `
      .mat-menu-content mat-menu-divider {
        margin-top: 4px;
        margin-bottom: 4px;
        height: 1px;
        min-height: 1px;
        max-height: 1px;
        width: 100%;
        display: block;
        background-color: rgba(0, 0, 0, 0.11);
      }
    `
  ]
})
export class MatMenuDividerComponent {
}
