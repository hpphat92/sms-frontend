import {
  Component,
  ViewEncapsulation,
  ElementRef,
  TemplateRef,
  Input,
  ContentChild,
  OnInit,
  forwardRef,
  Output,
  EventEmitter,
  OnChanges,
  HostListener
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR
} from '@angular/forms';

// ngModel
const DUAL_BOX_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => DualBoxComponent),
  multi: true
};

@Component({
  selector: 'dual-box',
  templateUrl: 'dual-box.template.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: [
    'dual-box.style.scss'
  ],
  exportAs: 'dualBox',
  providers: [DUAL_BOX_VALUE_ACCESSOR]
})
export class DualBoxComponent implements ControlValueAccessor, OnInit, OnChanges {
  @ContentChild(TemplateRef)
  public template;

  @Input()
  public source: any[] = [];

  public clonedSource: any[] = [];

  @Output('onChange')
  public onChangeCallback = new EventEmitter<any[]>();

  @HostListener('window:keydown', ['$event'])
  keyboardDown(event: KeyboardEvent) {
    this.isCtrlDown = event.keyCode === 17; // ctrl
  }

  @HostListener('window:keyup', ['$event'])
  keyboardUp(event: KeyboardEvent) {
    this.isCtrlDown = false;
  }

  // @HostListener('window:click', ['$event'])
  // onClick(event: KeyboardEvent) {
  //   console.log('clicking...', this.isCtrlDown);
  //   if(!this.isCtrlDown) {
  //     this.leftSelectedItem = [];
  //     this.rightSelectedItem = [];
  //   }
  // }

  public selected: any[] = [];
  public leftSelectedItem: any[] = [];
  public rightSelectedItem: any[] = [];
  public isCtrlDown: boolean = false;

  @Input()
  public leftTitle: string;

  @Input()
  public rightTitle: string;

  private element: any;

  constructor(private el: ElementRef) {
    this.element = el.nativeElement;
  }

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

  public select(data, item, index, side) {
    // If user click to the selected item, then mark this action as remove selected status
    let isRemove = !!item.__selected;
    if (!this.isCtrlDown) {
      // Clear all selected status
      this._clearSelected(data);
    }
    // Set selected status if not remove
    if (!isRemove) {
      item.__selected = true;
      // Save selected item
      if (side === 'left') {
        if (this.isCtrlDown) {
          this.leftSelectedItem = [...this.leftSelectedItem, {
            item,
            index
          }];
        } else {
          this.leftSelectedItem = [{
            item,
            index
          }];
        }
      }
      if (side === 'right') {
        if (this.isCtrlDown) {
          this.rightSelectedItem = [...this.rightSelectedItem, {
            item,
            index
          }];
        }
        else {
          this.rightSelectedItem = [{
            item,
            index
          }];
        }
      }
    } else {
      // Save selected item
      if (side === 'left') {
        this.leftSelectedItem = [];
      }
      if (side === 'right') {
        this.rightSelectedItem = [];
      }
    }
  }

  public addToRight() {
    if (this.leftSelectedItem) {
      this.leftSelectedItem.forEach(({item, index}) => {
        // Remove selected status
        item.__selected = false;
        // Add item from left to right
        if (!this.selected) {
          this.selected = [];
        }
        this.selected.push(item);
        // Remove item in list
        this.clonedSource.splice(index, 1);
      });
      this.leftSelectedItem = [];
      // update ngModel
      this._onChange(this._result());
      // Execute callback
      this.onChangeCallback.emit(this._result());
    }
  }

  public addToLeft() {
    if (this.rightSelectedItem) {
      this.rightSelectedItem.forEach(({item, index}) => {
        // Remove selected status
        item.__selected = false;
        // Add item from right to left
        this.clonedSource.push(item);
        // Remove item in list
        this.selected.splice(index, 1);
      });
      this.rightSelectedItem = [];
      // update ngModel
      this._onChange(this._result());
      // Execute callback
      this.onChangeCallback.emit(this._result());
    }
  }

  public addAllToRight() {
    this.selected = [...this.selected, ...this.clonedSource];
    this.clonedSource.splice(0, this.clonedSource.length);
    // update ngModel
    this._onChange(this._result());
    // Execute callback
    this.onChangeCallback.emit(this._result());
  }

  public addAllToLeft() {
    this.clonedSource = [...this.selected, ...this.clonedSource];
    this.selected.splice(0, this.selected.length);
    // update ngModel
    this._onChange(this._result());
    // Execute callback
    this.onChangeCallback.emit(this._result());
  }

  private _init() {
    if (this.selected && this.selected.length) {
      this.clonedSource = this.source.filter((item) => {
        // only keep item which not exists in selected list
        return this.selected.filter((sel) => this._isEquals(item, sel)).length === 0;
      });
    } else {
      this.clonedSource = this.source;
    }

    // Todo: Check selected list if item not exists in source
  }

  private _isEquals(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
  }

  private _clearSelected(data) {
    data.forEach((item) => {
      item.__selected = false;
    });
  }

  private _deepClone(oldArray: Object[]) {
    let newArray: any = [];
    oldArray.forEach((item) => {
      newArray.push(Object.assign({}, item));
    });
    return newArray;
  }

  private _result() {
    let result = this._deepClone(this.selected);
    result.forEach((v) => {
      delete v.__selected;
    });
    return result;
  }

  // ngModel
  private _onTouched = () => {
  };
  private _onChange = (_: any) => {
  };
}
