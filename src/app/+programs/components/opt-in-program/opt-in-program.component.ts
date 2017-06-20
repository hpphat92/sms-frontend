import {
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'opt-in-program',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'opt-in-program.template.html',
  styleUrls: ['opt-in-program.style.scss']
})
export class OptInProgramComponent {

  @Input() public campaignId: string;

}
