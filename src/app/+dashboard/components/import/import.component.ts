import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {
  DashboardService
} from '../../dashboard.service';

interface ImportModel {
  account_id: string;
  end_date: string;
  file_name: string;
  imported: number;
  list_id: string;
  start_date: string;
  status: string;
  _id: string;
}

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'import',  // <statistic></statistic>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'import.template.html',
  styleUrls: []
})
export class ImportComponent {
  public imports: ImportModel[] = [];

  constructor(private _dashboardService: DashboardService) {
    _dashboardService.getImports().then((data: ImportModel[]) => {
      this.imports = data;
    });
  }
}
