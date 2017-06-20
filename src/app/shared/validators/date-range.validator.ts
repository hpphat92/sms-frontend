import {
  AbstractControl
} from '@angular/forms';

import moment from 'moment';

export const DateRange = (minDateControl) => {

  return (control: AbstractControl): Promise<{ [key: string]: boolean }> => {
    let maxDate = control.value;
    const input1 = control.parent && control.parent.get(minDateControl);

    return new Promise((resolve) => {

      if (input1) {
        input1.valueChanges.subscribe((data) => {

          if (moment(maxDate).diff(moment(data)) <= 0) {
            control.updateValueAndValidity();
            resolve({dateRangeInvalid: true});
          } else {
            control.updateValueAndValidity();
            resolve(null);
          }
        });

        if (moment(maxDate).diff(moment(input1.value)) <= 0) {
          resolve({dateRangeInvalid: true});
        } else {
          resolve(null);
        }
      } else {
        resolve(null);
      }
    });
  };
};
