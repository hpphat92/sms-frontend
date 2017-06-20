import {
  AbstractControl
} from '@angular/forms';

export const ExcludeValidator = () => {
  return (control: AbstractControl): { [key: string]: boolean } => {
    let value = control.value;

    return value.match(/STOPALL|STOP|HELP|UNSUBSCRIBE|YES|NO|CANCEL/)
      ? {invalidExclude: true} : null;
  };
};
