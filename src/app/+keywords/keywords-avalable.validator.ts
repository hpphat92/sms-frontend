import {
  AbstractControl
} from '@angular/forms';
import { KeywordService } from './keywords.service';

export class KeywordAvailableValidator {

  public subscription: any;

  constructor(private _keywordService: KeywordService) {
  }

  public validate(control: AbstractControl): Promise<any> {

    // Un subscribe old observable to prevent duplicate calling api
    if (this.subscription) {
      this.subscription.unsubscribe();
    }

    return new Promise((resolve) => {
      this.subscription = control
        .valueChanges
        .debounceTime(500)  // Debounce time for each value emited
        .distinctUntilChanged() // Make distinct emit value
        .filter((term) => term.length <= 15) // Filter emitted value with length <= 15
        // switch map emit value to observable returned from calling http request
        .switchMap((term) => this._keywordService.getKeywordById(term.toUpperCase()))
        .subscribe({
          next: (data) => {
            if (data._id) {
              resolve({notAvailable: true});
            } else {
              resolve(null);
            }
          },
          error: (error) => {
            resolve(null);
          }
        });
    });
  }
}
