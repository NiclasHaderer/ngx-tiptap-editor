import { Component, forwardRef } from '@angular/core';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-bullet-list-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="toggleList()" [class.active]="editor?.isActive('bulletList')">
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_list_bulleted</i>
    </button>`,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => BulletListControlComponent)}],
})
export class BulletListControlComponent extends BaseControl {
  public toggleList(): void {
    this.editor && this.editor.chain().focus().toggleBulletList().focus().run();
  }
}
