import {
  Component, Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'widget',  // <widget></widget>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'widget.template.html',
  styleUrls: []
})
export class WidgetComponent {
  @Input() public title: string;
  @Input() public number: number;
  @Input() public titleColor: string;
}
