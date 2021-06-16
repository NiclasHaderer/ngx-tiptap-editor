import { DOCUMENT } from '@angular/common';
import { Component, forwardRef, Inject, Input, NgZone, OnInit } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { delay, filter, takeUntil, tap } from 'rxjs/operators';
import { asyncFilter, fromEditorEvent, sleep } from '../../../helpers';
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
    this.eventService.registerShortcut('Mod-k')
      .pipe(
        tap((e) => e.preventDefault()),
        asyncFilter(() => this.can()),
        takeUntil(this.destroy$),
      )
      .subscribe((e) => {
        e.preventDefault();
        this.openLinkDialog();
      });

    fromEditorEvent(editor, 'transaction').pipe(
      takeUntil(this.destroy$),
    ).subscribe(({editor: e}) => this.openLinkPreview(e));

    fromEditorEvent(editor, 'blur').pipe(
      filter(() => !!this.tooltipRef),
      delay(500),
      takeUntil(this.destroy$),
    ).subscribe(() => this.closeLinkPreview());
  }

  public async openLinkDialog(): Promise<void> {
    if (!this.editor) return;

    const link = this.editor.getAttributes('link');
    const data = link.href ? link.href : null;

    const ref = this.ngZone.run(() => this.dialogService.openDialog<string>(LinkSelectComponent, {
      width: 'auto', data: {
        link: data,
        popupText: this.popupText,
        inputPlaceholder: this.inputPlaceholder
      }
    }));
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

    // Get the link and the style of the anchor element
    const link: string | null = editor.getAttributes('link').href;

    const linkElement = this.getLinkElement(link);
    if (!linkElement) return this.closeLinkPreview();

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

  private getLinkElement(link: string | null): HTMLElement | null {

    let linkSelector = 'a';
    if (link) linkSelector = `a[href="${link}"]`;

    // Get current selection
    const selection = this.document.getSelection();

    // Check if the link element can be found
    if (!selection || !selection.anchorNode || !selection.anchorNode.parentElement) return null;

    // Get the link element and query for it if the parent node is not a link
    const startElement: HTMLElement = selection.anchorNode.parentElement;
    let newLinkElement: null | HTMLElement = startElement;
    if (newLinkElement.tagName !== 'A') newLinkElement = startElement.querySelector(linkSelector);

    if (!newLinkElement) newLinkElement = startElement.closest(linkSelector);
    if (!newLinkElement) return null;
    return newLinkElement;
  }

  private closeLinkPreview(): void {
    if (this.tooltipRef) {
      this.ngZone.run(() => {
        this.tooltipRef!.closeDialog(null);
        this.tooltipRef = null;
      });
    }
  }
}
