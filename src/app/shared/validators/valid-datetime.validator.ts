import {
  AbstractControl
} from '@angular/forms';

import moment from 'moment';

export const ValidDateTime = (plusTime, plusType) => {
  return (control: AbstractControl): { [key: string]: boolean } => {
    let time = control.value;
    let validTime = moment().add(plusTime, plusType);

    return moment(time).diff(validTime) < 0 ? {dateTimeInvalid: true} : null;
  };
};
