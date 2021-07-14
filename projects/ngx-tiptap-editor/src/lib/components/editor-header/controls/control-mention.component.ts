import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy, OnInit } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';


@Component({
  selector: 'tip-control-mention',
  styleUrls: ['_styles.scss'],
  template: `
    <button type="button" (click)="toggleMention()" #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">person_add</i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlMentionComponent)}],
})
export class ControlMentionComponent extends ButtonBaseControl implements OnInit, OnDestroy {
  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleMention(): void {
    console.log('todo');
  }

  protected isActive(): boolean {
    return false;
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleBold();
  }

}
