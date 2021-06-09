import { Component, forwardRef } from '@angular/core';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-underline-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="toggleUnderline()" [class.active]="editor?.isActive('underline')">
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_underline</i>
    </button>
  `,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => UnderlineControlComponent)}],
})
export class UnderlineControlComponent extends BaseControl {
  public toggleUnderline(): void {
    this.editor && this.editor.chain().focus().toggleUnderline().focus().run();
  }
}
