import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-control-code',
  styleUrls: ['../../../../../_controls.scss'],
  template: `
    <button class="tip-control-button" type="button" (click)="toggleCode()" #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">code</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlCodeComponent)}],
})
export class ControlCodeComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleCode(): void {
    this.editor && this.editor.chain().focus().toggleCode().run();
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleCode();
  }

  protected isActive(...args: any): boolean {
    return !!this.editor?.isActive('code');
  }
}
