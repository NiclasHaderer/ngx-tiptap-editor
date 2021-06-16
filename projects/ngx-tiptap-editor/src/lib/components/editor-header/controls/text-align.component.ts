import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, SelectBaseControl } from './base-control';

@Component({
  selector: 'tip-text-align-control',
  styleUrls: ['_styles.scss'],
  template: `
    <tip-select defaultValue="left" width="auto" [showIcon]="false"
                (change)="setAlign($event)">
      <tip-option value="left" [useHtml]="true" [enforceHeight]="true">
        <i class="material-icons">format_align_left</i>
      </tip-option>
      <tip-option value="right" [useHtml]="true" [enforceHeight]="true">
        <i class="material-icons">format_align_right</i>
      </tip-option>
      <tip-option value="center" [useHtml]="true" [enforceHeight]="true">
        <i class="material-icons">format_align_center</i>
      </tip-option>
      <tip-option value="justify" [useHtml]="true" [enforceHeight]="true">
        <i class="material-icons">format_align_justify</i>
      </tip-option>
    </tip-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => TextAlignControlComponent)}],
})
export class TextAlignControlComponent extends SelectBaseControl {
  protected canStyleParams = ['left', 'right', 'center', 'justify'];

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public setAlign(alignment: 'justify' | 'left' | 'center' | 'right'): void {
    this.editor && this.editor.chain().focus().setTextAlign(alignment).run();
  }

  protected canStyle(alignment: 'justify' | 'left' | 'center' | 'right'): boolean {
    if (!this.editor) return false;
    return this.editor.can().setTextAlign(alignment);
  }

  protected currentActive(): 'left' | 'right' | 'center' | 'justify' | null {
    if (this.editor) {
      if (this.editor.isActive({textAlign: 'left'})) return 'left';
      if (this.editor.isActive({textAlign: 'right'})) return 'right';
      if (this.editor.isActive({textAlign: 'center'})) return 'center';
      if (this.editor.isActive({textAlign: 'justify'})) return 'justify';
    }
    return null;
  }
}
