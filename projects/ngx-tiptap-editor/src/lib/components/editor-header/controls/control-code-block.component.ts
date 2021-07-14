import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-code-block-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button type="button" (click)="toggleCodeBlock()" #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">integration_instructions</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlCodeBlockComponent)}],
})
export class ControlCodeBlockComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleCodeBlock(): void {
    this.editor && this.editor.chain().focus().toggleCodeBlock().run();
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleCodeBlock();
  }

  protected isActive(...args: any): boolean {
    return !!this.editor?.isActive('codeBlock');
  }
}
