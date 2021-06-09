import { Component, forwardRef } from '@angular/core';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-italic-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="toggleItalic()" [class.active]="editor?.isActive('italic')">
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_italic</i>
    </button>`,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ItalicControlComponent)}],
})
export class ItalicControlComponent extends BaseControl {
  public toggleItalic(): void {
    this.editor && this.editor.chain().focus().toggleItalic().focus().run();
  }
}
