import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-underline-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button type="button" (click)="toggleUnderline()" #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_underline</i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => UnderlineControlComponent)}],
})
export class UnderlineControlComponent extends ButtonBaseControl {

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
