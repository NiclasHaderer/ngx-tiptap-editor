import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-control-strike',
  styleUrls: ['../../../../../_controls.scss'],
  template: `
    <button class="tip-control-button" type="button" (click)="toggleList()" #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_strikethrough</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlStrikeComponent)}],
})
export class ControlStrikeComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleList(): void {
    this.editor && this.editor.chain().focus().toggleStrike().run();
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleStrike();
  }

  protected isActive(...args: any): boolean {
    return !!this.editor?.isActive('strike');
  }
}
