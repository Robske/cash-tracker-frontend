import { Component, forwardRef, Input } from '@angular/core';
import { KeyValue } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select-input',
  templateUrl: './select-input.component.html',
  styleUrls: ['./select-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectInputComponent)
    }
  ]
})
export class SelectInputComponent implements ControlValueAccessor {
  @Input() label = '';
  @Input() placeholder = '';
  @Input() options?: KeyValue<string, string>[] = [];
  public selected?: string;

  public onChange: any = () => {
    //callback
  };

  public onTouch: any = () => {
    //callback
  };

  public onSelect($event: any): void {
    this.onChange(  //return key instead of value
      this.options?.filter((x: KeyValue<string, string>) =>
        x.value === ($event.target as HTMLSelectElement).value)[0].key);
  }

  public writeValue(value: string): void {
    this.selected = value;
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
