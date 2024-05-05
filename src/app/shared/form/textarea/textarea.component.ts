import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.less'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => TextareaComponent)
    }
  ]
})
export class TextareaComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() classes = '';
  @Input() placeholder = '';
  @Input() maxLength = 50;
  @Input() rows = 3;

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
    // implement
  }

}
