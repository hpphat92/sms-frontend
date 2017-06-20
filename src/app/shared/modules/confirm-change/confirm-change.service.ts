import {
  Injectable
} from '@angular/core';

import { AppConstant } from '../app.constant';

import { DialogCloseResult, DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { ConfirmChangeComponent } from './confirm-change.component';

@Injectable()
export class ConfirmService {

  constructor(private _dialogService: DialogService) {

  }

  public show(message: string, cb: any, isDelete?: boolean, title?: any,
              yesText?: string, noText?: string, notTitle?: boolean, isCountDown?: boolean) {
    const dialog: DialogRef = this._dialogService.open({
      title: notTitle ? undefined : title ? title : 'Please confirm',
      content: ConfirmChangeComponent,
      actions: [
        {text: noText ? noText : 'No'},
        {text: yesText ? yesText : 'Yes', primary: true}
      ]
    });

    let modalInstance = dialog.content.instance;
    modalInstance.message = message;
    modalInstance.isDelete = isDelete;
    modalInstance.modalInstance = dialog;
    if (isCountDown) {
      modalInstance.type = 'countdown';
    }

    dialog.result.subscribe((result: any) => {
      cb(result.text);
    });
  }
}
