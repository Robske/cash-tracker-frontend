import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-label-result',
  templateUrl: './label-result.component.html',
  styleUrls: ['./label-result.component.scss']
})
export class LabelResultComponent {
  @Input() label = '';
  @Input() result = 0;
}
