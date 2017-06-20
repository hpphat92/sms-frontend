import {
  Component,
  ViewEncapsulation,
  ElementRef,
  TemplateRef,
  ContentChild,
  OnInit,
  forwardRef,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { DayList } from '../../programs.model';

// ngModel
const DUAL_BOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectDayComponent),
  multi: true
};

@Component({
  selector: 'select-day',
  templateUrl: 'select-day.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['select-day.style.scss'],
  providers: [DUAL_BOX_VALUE_ACCESSOR]
})
export class SelectDayComponent implements ControlValueAccessor, OnInit, OnChanges {
  @ContentChild(TemplateRef)
  public template;

  public selected: number[] = [];

  public source = DayList;
  public clonedSource: any;

  public ngOnInit() {
    this.clonedSource = this.source;
    this._init();
  }

  public ngOnChanges() {
    this.clonedSource = this.source;
    // source changed
    this._init();
  }

  // get accessor
  public get value(): any {
    return this.selected;
  };

  // set accessor including call the onchange callback
  // ngModal changes from outside
  public set value(v: any) {
    this._onChange(v);
  }

  // From ControlValueAccessor interface
  public registerOnChange(fn: (value: any) => any): void {
    this._onChange = fn;
  }

  // From ControlValueAccessor interface
  public registerOnTouched(fn: () => any): void {
    this._onTouched = fn;
  }

  // From ControlValueAccessor interface
  // ngModel change
  public writeValue(value: any) {
    this.selected = value;
    this._init();
  }

  public toggle(idx) {
    this.clonedSource[idx].selected = !this.clonedSource[idx].selected;

    let existIndex = -1;
    this.selected.filter((obj, index) => {

      if (obj === idx) {
        existIndex = index;
      }
      return obj === idx;
    });

    if (existIndex === -1) {
      this.selected.push(idx);
    } else {
      this.selected.splice(existIndex, 1);
    }

    // update ngModel
    this._onChange(this.selected.sort());
  }

  private _init() {
    if (this.selected && this.selected.length) {
      this.selected.forEach((obj) => {
        this.clonedSource[obj].selected = true;
      });
    }
  }

  // ngModel
  private _onTouched = () => {
  };
  private _onChange = (_: any) => {
  };
}
