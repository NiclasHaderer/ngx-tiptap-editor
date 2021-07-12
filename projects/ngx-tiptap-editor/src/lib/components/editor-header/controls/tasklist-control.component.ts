import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-task-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button type="button" (click)="toggleTask()" #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">checklist</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => TaskListControlComponent)}],
})
export class TaskListControlComponent extends ButtonBaseControl {

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public toggleTask(): void {
    this.editor && this.editor.chain().focus().toggleTaskList().run();
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleTaskList();
  }

  protected isActive(...args: any): boolean {
    return !!this.editor?.isActive('taskList');
  }
}
