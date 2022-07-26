import { ChangeDetectionStrategy, Component, forwardRef, OnDestroy } from '@angular/core';
import { Editor } from '@tiptap/core';
import { NgxLink } from '../../extensions/custom/ngx-link';
import { EditorEvent } from '../../models/types';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { TiptapExtensionService } from '../../services/tiptap-extension.service';
import { BaseControl, ButtonBaseControl } from './base-control';

// @dynamic
@Component({
  selector: 'tip-control-link',
  styleUrls: ['../../../../_controls.scss'],
  template: `
    <button class="tip-control-button" type="button" (click)="openLinkDialog()" disabled #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">link</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlLinkComponent)}],
})
export class ControlLinkComponent extends ButtonBaseControl implements OnDestroy {
  protected updateEvent = 'selectionUpdate' as EditorEvent;
  private linkExtension!: NgxLink;

  constructor(
    protected eventService: TiptapEventService,
    private extensionService: TiptapExtensionService,
  ) {
    super();
  }

  public onEditorReady(editor: Editor): void {
    this.linkExtension = this.extensionService.getExtension('link') as unknown as NgxLink;
  }

  public async can(): Promise<boolean> {
    return this.linkExtension.can();
  }

  public async openLinkDialog(): Promise<void> {
    return this.linkExtension.openCreateLinkDialog();
  }

  protected isActive(): boolean {
    return this.linkExtension.isActive();
  }
}
