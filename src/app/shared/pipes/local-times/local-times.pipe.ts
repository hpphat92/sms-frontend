import {
  Pipe,
  PipeTransform
} from '@angular/core';

import * as moment from 'moment';

@Pipe({name: 'myLocalTimes'})
export class LocalTimesPipe implements PipeTransform {
  public transform(value, format?: string): any {
    let fm = format || 'MM/DD/YYYY hh:mm A';
    return value ? moment(value).utc(true).format(fm) : '';
  }
}
