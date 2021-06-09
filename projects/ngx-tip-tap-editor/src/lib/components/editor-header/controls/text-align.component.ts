import { Component, forwardRef } from '@angular/core';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-text-align-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="setAlign('left')" [class.active]="editor?.isActive({textAlign: 'left'})">
      <i class="material-icons">format_align_left</i>
    </button>
    <button (click)="setAlign('right')" [class.active]="editor?.isActive({textAlign: 'right'})">
      <i class="material-icons">format_align_right</i>
    </button>
    <button (click)="setAlign('center')" [class.active]="editor?.isActive({textAlign: 'center'})">
      <i class="material-icons">format_align_center</i>
    </button>
    <button (click)="setAlign('justify')" [class.active]="editor?.isActive({textAlign: 'justify'})">
      <i class="material-icons">format_align_justify</i>
    </button>
  `,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => TextAlignControlComponent)}],
})
export class TextAlignControlComponent extends BaseControl {
  public setAlign(alignment: 'justify' | 'left' | 'center' | 'right'): void {
    this.editor && this.editor.chain().focus().setTextAlign(alignment).run();
  }
}
