import { Component } from '@angular/core';
import { faNotEqual, faInfo, faPlus, faRemove } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-patch-notes',
  templateUrl: './patch-notes.component.html',
  styleUrls: ['./patch-notes.component.scss']
})
export class PatchNotesComponent {
  public iconInfo = faInfo;
  public iconChange = faNotEqual;
  public iconAddition = faPlus;
  public iconRemove = faRemove;
}
