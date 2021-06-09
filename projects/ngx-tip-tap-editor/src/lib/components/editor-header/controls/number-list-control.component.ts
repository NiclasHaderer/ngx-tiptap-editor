import { Component, forwardRef } from '@angular/core';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-number-list-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="toggleList()" [class.active]="editor?.isActive('orderedList')">
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_list_numbered</i>
    </button>`,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => NumberListControlComponent)}],
})
export class NumberListControlComponent extends BaseControl {
  public toggleList(): void {
    this.editor && this.editor.chain().focus().toggleOrderedList().focus().run();
  }
}
