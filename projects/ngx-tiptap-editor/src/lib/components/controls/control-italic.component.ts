import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-control-italic',
  styleUrls: ['../../../../_controls.scss'],
  template: `
    <button class="tip-control-button" type="button" (click)="toggleItalic()" #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_italic</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlItalicComponent)}],
})
export class ControlItalicComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleItalic(): void {
    this.editor && this.editor.chain().focus().toggleItalic().run();
  }

  protected isActive(): boolean {
    return !!this.editor?.isActive('italic');
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleItalic();
  }
}
