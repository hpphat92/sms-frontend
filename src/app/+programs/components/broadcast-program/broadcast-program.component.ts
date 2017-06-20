import {
  Component,
  Input,
  ViewEncapsulation
} from '@angular/core';

@Component({
  selector: 'broadcast-program',
  encapsulation: ViewEncapsulation.None,
  templateUrl: 'broadcast-program.template.html',
  styleUrls: ['broadcast-program.style.scss']
})
export class BroadcastProgramComponent {
  @Input() public campaignId: string;
}
