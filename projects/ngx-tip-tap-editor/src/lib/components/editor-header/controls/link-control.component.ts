import { DOCUMENT } from '@angular/common';
import { Component, forwardRef, Inject, NgZone, OnInit } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { fromEditorEvent, sleep } from '../../../helpers';
import { DialogService } from '../../../services/dialog.service';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { DialogRef } from '../../dialog/dialog.helpers';
import { LinkPreviewComponent } from '../../link/preview';
import { LinkSelectComponent } from '../../link/selection';
import { BaseControl, ButtonBaseControl } from './base-control';

@Component({
  selector: 'tip-link-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button class="material-icons" (click)="openLinkDialog()" #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">link</i>
    </button>
  `,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => LinkControlComponent)}],
})
export class LinkControlComponent extends ButtonBaseControl implements OnInit {
  private tooltipRef: DialogRef<any, any, any> | null = null;

  constructor(
    private dialogService: DialogService,
    protected eventService: TiptapEventService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  public onEditorReady(editor: Editor): void {
    this.eventService.registerShortcut('Mod-k').pipe(takeUntil(this.destroy$)).subscribe((e) => {
      this.ngZone.run(() => {
        e.preventDefault();
        this.openLinkDialog();
      });
    });

    fromEditorEvent(editor, 'transaction').pipe(
      takeUntil(this.destroy$)
    ).subscribe(({editor: e}) => this.openLinkPreview(e));

    fromEditorEvent(editor, 'blur').pipe(
      filter(() => !!this.tooltipRef),
      delay(100),
      takeUntil(this.destroy$)
    ).subscribe(() => this.ngZone.run(() => this.tooltipRef?.closeDialog(null)));
  }

  public async openLinkDialog(): Promise<void> {
    if (!this.editor) return;

    const link = this.editor.getAttributes('link');
    const data = link.href ? link.href : null;

    const ref = this.dialogService.openDialog<string>(LinkSelectComponent, {width: 'auto', data});
    const result = await ref.result$.toPromise();
    if (result.status === 'canceled') return;

    this.editor.chain().focus().setLink({href: result.data}).run();
  }

  public async can(): Promise<boolean> {
    await sleep(0);
    if (!this.editor) return false;

    const selection = this.editor.state.selection;
    if (selection.from === selection.to) return false;

    return !!this.editor?.can().setLink({href: ''}) && !this.isActive();
  }

  protected isActive(): boolean {
    return !!this.editor && 'href' in this.editor.getAttributes('link');
  }

  private async openLinkPreview(editor: Editor): Promise<void> {

    if (!this.isActive()) {
      this.tooltipRef && this.tooltipRef.closeDialog(null);
      this.tooltipRef = null;
      return;
    }

    if (this.tooltipRef) return;

    const selection = this.document.getSelection();
    if (!selection || !selection.anchorNode) return;

    let linkElement = selection.anchorNode.parentElement!;
    if (linkElement.tagName !== 'A') linkElement = linkElement.querySelector('a')!;

    const link = editor.getAttributes('link').href;
    const position = linkElement.getBoundingClientRect();

    await this.ngZone.run(async () => {
      const closePromise = this.tooltipRef = this.dialogService.openPopover(LinkPreviewComponent, {
        position: {
          x: position.x + position.width / 2,
          y: position.y
        },
        data: link
      });
      const result = await closePromise.result$.toPromise();
      if (result.data === 'delete' && this.editor) this.editor.chain().focus().unsetLink().run();
      this.tooltipRef = null;
    });
  }
}
