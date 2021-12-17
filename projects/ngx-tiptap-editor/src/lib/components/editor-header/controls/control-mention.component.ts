import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, OnDestroy, Output } from '@angular/core';
import { Editor } from '@tiptap/core';
import { takeUntil } from 'rxjs/operators';
import { MentionData, NgxMention } from '../../../extensions/custom/mention/ngx-mention';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { TiptapExtensionService } from '../../../services/tiptap-extension.service';
import { BaseControl, ButtonBaseControl } from './base-control';

export type MentionCallback = (props: MentionData) => void;

@Component({
  selector: 'tip-control-mention',
  styleUrls: ['../../../../../_controls.scss'],
  template: `
    <button class="tip-control-button" type="button" (click)="updateMention()" #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">person_add</i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlMentionComponent)}],
})
export class ControlMentionComponent extends ButtonBaseControl implements OnDestroy {

  @Output() createMention = new EventEmitter<MentionCallback>();
  @Output() mentionClicked = new EventEmitter<MentionData>();

  private mentionExtension!: NgxMention;

  constructor(
    protected eventService: TiptapEventService,
    private extensionService: TiptapExtensionService
  ) {
    super();
  }

  public onEditorReady(editor: Editor): void {
    this.mentionExtension = this.extensionService.getExtension('mention') as unknown as NgxMention;
    this.mentionExtension.onClick$.pipe(takeUntil(this.destroy$)).subscribe(e => this.mentionClicked.emit(e));
  }

  public updateMention(): void {
    this.createMention.emit((props) => this.editor?.chain().focus().setMention({props}).run());
  }

  protected isActive(): boolean {
    return false;
  }

  protected can(): boolean {
    return !!this.editor?.can().setMention({props: {id: ''}});
  }

}
