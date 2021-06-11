import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-number-list-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="toggleList()" #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_list_numbered</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => NumberListControlComponent)}],
})
export class NumberListControlComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleList(): void {
    this.editor && this.editor.chain().focus().toggleOrderedList().focus().run();
  }

  protected can(...args: any): boolean {
    return !!this.editor?.can().toggleOrderedList();
  }

  protected isActive(...args: any): boolean {
    return !!this.editor?.isActive('orderedList');
  }
}
