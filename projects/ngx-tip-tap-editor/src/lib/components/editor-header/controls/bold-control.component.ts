import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';


@Component({
  selector: 'tip-bold-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="toggleBold()" [class.active]="editor?.isActive('bold')" #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_bold</i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => BoldControlComponent)}],
})
export class BoldControlComponent extends ButtonBaseControl implements OnInit, OnDestroy {
  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleBold(): void {
    this.editor && this.editor.chain().focus().toggleBold().focus().run();
  }

  protected isActive(): boolean {
    return !!this.editor?.isActive('bold');
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleBold();
  }

}
