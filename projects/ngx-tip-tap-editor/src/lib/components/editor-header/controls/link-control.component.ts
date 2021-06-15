import { DOCUMENT } from '@angular/common';
import { Component, forwardRef, Inject, Input, NgZone, OnInit } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { fromEditorEvent, sleep } from '../../../helpers';
import { DialogService } from '../../../services/dialog.service';
import { TiptapEventService } from '../../../services/tiptap-event.service';
import { DialogRef } from '../../dialog/dialog.helpers';
import { LinkPreviewComponent } from '../../link/preview';
import { LinkSelectComponent } from '../../link/selection';
import { BaseControl, ButtonBaseControl } from './base-control';

// @dynamic
@Component({
  selector: 'tip-link-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button (click)="openLinkDialog()" disabled #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">link</i>
    </button>`,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => LinkControlComponent)}],
})
export class LinkControlComponent extends ButtonBaseControl implements OnInit {
  @Input() popupText = 'Input your link';
  @Input() inputPlaceholder = 'Input link';

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
      takeUntil(this.destroy$),
    ).subscribe(() => this.closeLinkPreview());
  }

  public async openLinkDialog(): Promise<void> {
    if (!this.editor) return;

    const link = this.editor.getAttributes('link');
    const data = link.href ? link.href : null;

    const ref = this.dialogService.openDialog<string>(LinkSelectComponent, {
      width: 'auto', data: {
        link: data,
        popupText: this.popupText,
        inputPlaceholder: this.inputPlaceholder
      }
    });
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

    if (
      // Not active
      !this.isActive() ||
      // Text selection
      editor.view.state.selection.from !== editor.view.state.selection.to
    ) {
      return this.closeLinkPreview();
    }

    // Already open
    if (this.tooltipRef) return;

    // Get current selection
    const selection = this.document.getSelection();

    // Check if the link element can be found
    if (!selection || !selection.anchorNode || !selection.anchorNode.parentElement) return;

    // Get the link element and query for it if the parent node is not a link
    let linkElement: HTMLElement | null = selection.anchorNode.parentElement;
    if (linkElement.tagName !== 'A') linkElement = linkElement.querySelector('a');

    if (!linkElement) return;

    // Get the link and the style of the anchor element
    const link = editor.getAttributes('link').href;
    const position = linkElement.getBoundingClientRect();

    this.tooltipRef = this.ngZone.run(() => this.dialogService.openPopover(LinkPreviewComponent, {
      position: {
        x: position.x + position.width / 2,
        y: position.y
      },
      data: link
    }));

    const result = await this.tooltipRef.result$.toPromise();
    if (result.data === 'delete' && this.editor) this.editor.chain().focus().unsetLink().run();
    this.closeLinkPreview();
  }

  private closeLinkPreview(): void {
    this.ngZone.run(() => {
      this.tooltipRef && this.tooltipRef.closeDialog(null);
      this.tooltipRef = null;
    });
  }
}
