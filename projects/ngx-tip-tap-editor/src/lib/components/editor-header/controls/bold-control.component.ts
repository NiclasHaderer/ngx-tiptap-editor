import { Component, forwardRef } from '@angular/core';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-bold-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="toggleBold()" [class.active]="editor?.isActive('bold')">
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_bold</i>
    </button>
  `,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => BoldControlComponent)}],
})
export class BoldControlComponent extends BaseControl {
  public toggleBold(): void {
    this.editor && this.editor.chain().focus().toggleBold().focus().run();
  }
}
