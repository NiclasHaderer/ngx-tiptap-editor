import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-control-number-list',
  styleUrls: ['_styles.scss'],
  template: `
    <button class="tip-control-button" type="button" (click)="toggleList()" #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons-round">format_list_numbered</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlNumberListComponent)}],
})
export class ControlNumberListComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleList(): void {
    this.editor && this.editor.chain().focus().toggleOrderedList().run();
  }

  protected can(...args: any): boolean {
    return !!this.editor?.can().toggleOrderedList();
  }

  protected isActive(...args: any): boolean {
    return !!this.editor?.isActive('orderedList');
  }
}
