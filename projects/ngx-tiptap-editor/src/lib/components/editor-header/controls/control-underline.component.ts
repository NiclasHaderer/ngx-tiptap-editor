import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-control-underline',
  styleUrls: ['_styles.scss'],
  template: `
    <button class="tip-control-button" type="button" (click)="toggleUnderline()" #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons-round">format_underline</i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlUnderlineComponent)}],
})
export class ControlUnderlineComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleUnderline(): void {
    this.editor && this.editor.chain().focus().toggleUnderline().run();
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleUnderline();
  }

  protected isActive(): boolean {
    return !!this.editor?.isActive('underline');
  }
}
