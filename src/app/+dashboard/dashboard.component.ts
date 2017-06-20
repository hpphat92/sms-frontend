import {
  Component,
  ViewEncapsulation
} from '@angular/core';

import {
  ApiClient
} from '../shared/services/api-client';

declare let apiGateway: any;
declare let uritemplate: any;

@Component({
  // The selector is what angular internally uses
  // for `document.querySelectorAll(selector)` in our index.html
  // where, in this case, selector is the string 'home'
  selector: 'dashboard',  // <dashboard></dashboard>
  // Our list of styles in our component. We may add more to compose many styles together
  encapsulation: ViewEncapsulation.None,
  // Every Angular template is first compiled by the browser before Angular runs it's compiler
  templateUrl: 'dashboard.template.html',
  styleUrls: [
    'dashboard.style.scss'
  ]
})
export class DashboardComponent {
  constructor() {
    // let apiClient = new ApiClient();
    //
    // let params = {
    //   id: '58e29f562dcda0da8ff596ff'
    // };
    // apiGateway.core.utils.assertParametersDefined(params, ['id'], ['body']);
    // let requestOptions = {
    //   path: apiClient.pathComponent + uritemplate('/lists/{id}').expand(apiGateway.core.utils.parseParametersToObject(params, ['id'])),
    //   headers: apiGateway.core.utils.parseParametersToObject(params, []),
    //   queryParams: apiGateway.core.utils.parseParametersToObject(params, []),
    //   body: null
    // };
    //
    // apiClient.get(requestOptions, {}).then((result) => {
    //   console.log('Received data: ' + JSON.stringify(result));
    // });
  }
}
