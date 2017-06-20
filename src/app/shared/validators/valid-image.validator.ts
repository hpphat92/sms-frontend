import {
  AbstractControl
} from '@angular/forms';

export function ValidImageValidator() {
  return (control: AbstractControl): Promise<{[key: string]: boolean}> => {
    return new Promise((resolve) => {
      let value = control.value ? control.value.trim() : '';
      // Ignore empty
      if (!value) {
        resolve(null);
        return;
      }

      // Validate url must be an valid url
      if (value && !/^http(.*)\.(jpg|jpeg|gif|png|bmp)$/.test(value)) {
        resolve({imageInvalid: true});
        return;
      }

      let img = new Image();

      img.onload = () => {
        resolve(null);
      };

      img.onerror = ($event) => {
        resolve({imageInvalid: true});
      };

      img.src = value;
    });
  };
}
