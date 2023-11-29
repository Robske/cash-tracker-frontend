import { Component, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./password-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => PasswordInputComponent)
    }
  ]
})
export class PasswordInputComponent {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() maxLength = 50;
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
