import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrls: ['./number-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NumberInputComponent)
    }
  ]
})
export class NumberInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() step = "1";
  public input = '';

  public onChange: any = () => {
    //callback
  };

  public onTouch: any = () => {
    //callback
  };

  public onModelChange(value: string): void {
    this.onChange(value);
  }

  public writeValue(value: string): void {
    this.input = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public setDisabledState?(isDisabled: boolean): void {
    //implement
  }
}
