import { Component, forwardRef } from '@angular/core';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-text-align-control',
  styleUrls: ['_styles.scss'],
  template: `
    <tip-select [value]="getAlignment()" defaultValue="left" width="auto" [showDropdown]="false"
                (change)="setAlign($event)">
      <tip-option value="left" [useHtml]="true">
        <i class="material-icons">format_align_left</i>
      </tip-option>
      <tip-option value="right" [useHtml]="true">
        <i class="material-icons">format_align_right</i>
      </tip-option>
      <tip-option value="center" [useHtml]="true">
        <i class="material-icons">format_align_center</i>
      </tip-option>
      <tip-option value="justify" [useHtml]="true">
        <i class="material-icons">format_align_justify</i>
      </tip-option>
    </tip-select>
  `,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => TextAlignControlComponent)}],
})
export class TextAlignControlComponent extends BaseControl {
  public setAlign(alignment: 'justify' | 'left' | 'center' | 'right'): void {
    this.editor && this.editor.chain().focus().setTextAlign(alignment).run();
  }

  public getAlignment(): 'left' | 'right' | 'center' | 'justify' | null {
    if (this.editor) {
      if (this.editor.isActive({textAlign: 'left'})) return 'left';
      if (this.editor.isActive({textAlign: 'right'})) return 'right';
      if (this.editor.isActive({textAlign: 'center'})) return 'center';
      if (this.editor.isActive({textAlign: 'justify'})) return 'justify';
    }
    return null;
  }
}
