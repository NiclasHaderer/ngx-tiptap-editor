import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-control-hr',
  styleUrls: ['_styles.scss'],
  template: `
    <button class="tip-control-button" type="button" (click)="addHorizontalRule()" #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons-round">horizontal_rule</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => HorizontalRuleControlComponent)}],
})
export class HorizontalRuleControlComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public addHorizontalRule(): void {
    this.editor && this.editor.chain().focus().setHorizontalRule().run();
  }

  protected can(): boolean {
    return !!this.editor?.can().setHorizontalRule();
  }

  protected isActive(...args: any): boolean {
    return false;
  }
}
