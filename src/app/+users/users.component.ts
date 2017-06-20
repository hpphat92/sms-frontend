import {
  Component,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'user',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'users.template.html',
  styleUrls: [
    'users.style.scss'
  ]
})
export class UserComponent {
  constructor() {

  }
}
