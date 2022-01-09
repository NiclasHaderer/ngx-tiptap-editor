import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy } from '@angular/core';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';


@Component({
  selector: 'tip-control-bold',
  styleUrls: ['../../../../_controls.scss'],
  template: `
    <button class="tip-control-button" type="button" (click)="toggleBold()" #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_bold</i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlBoldComponent)}],
})
export class ControlBoldComponent extends ButtonBaseControl implements OnDestroy {
  constructor(
    protected eventService: TiptapEventService,
  ) {
    super();
  }

  public toggleBold(): void {
    this.editor && this.editor.chain().focus().toggleBold().run();
  }

  protected isActive(): boolean {
    return !!this.editor?.isActive('bold');
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleBold();
  }
}
