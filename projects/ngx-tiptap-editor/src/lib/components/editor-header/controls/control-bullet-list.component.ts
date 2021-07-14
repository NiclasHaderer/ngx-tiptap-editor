import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-bullet-list-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button type="button" (click)="toggleList()" #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_list_bulleted</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlBulletListComponent)}],
})
export class ControlBulletListComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleList(): void {
    this.editor && this.editor.chain().focus().toggleBulletList().run();
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleBulletList();
  }

  protected isActive(...args: any): boolean {
    return !!this.editor?.isActive('bulletList');
  }
}
