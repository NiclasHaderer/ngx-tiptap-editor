import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { AnyExtension, Editor } from '@tiptap/core';
import { Link, LinkOptions } from '@tiptap/extension-link';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { DialogRef, ResultData } from '../../components/dialog/dialog.helpers';
import { LinkPreviewComponent } from '../../components/link/preview';
import { LinkSelectComponent, LinkSelectionProps } from '../../components/link/selection';
import {
  fromEditorEvent,
  getLinkDOMFromCursorPosition,
  getLinkFromCursorPosition,
  getSelectedEditorTextPosition
} from '../../helpers';
import { TipDialogService } from '../../services/dialog.service';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { TipBaseExtension } from '../tip-base-extension';

export interface NgxLinkOptions {
  native: Partial<LinkOptions>;
  ng: Partial<{
    inputPlaceholder: string;
  }>;
}

// @dynamic
@Injectable()
export class NgxLink extends TipBaseExtension<NgxLinkOptions> {

  public defaultOptions: Partial<NgxLinkOptions> = {
    ng: {
      inputPlaceholder: 'Input a link',
    }
  };
  private createDialog: DialogRef<any, any, any> | null = null;
  private previewDialog: DialogRef<any, any, any> | null = null;
  private linkElement: HTMLAnchorElement | null = null;

  constructor(
    private dialogService: TipDialogService,
    protected eventService: TiptapEventService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  public onEditorDestroy(): void {
    this.closeLinkPreview();
    this.createDialog?.cancel();
  }

  public onEditorReady(): void {
    this.eventService.registerShortcut('Mod-k')
      .pipe(
        tap((e) => e.preventDefault()),
        filter(() => this.can()),
        takeUntil(this.destroy$),
      ).subscribe(() => this.openCreateLinkDialog());

    fromEditorEvent(this.editor, 'transaction').pipe(
      takeUntil(this.destroy$),
      filter(e => !e.transaction.getMeta('blur')),
    ).subscribe(({editor: e}) => this.toggleLinkPreview(e));
  }

  public createExtension(extensionOptions: NgxLinkOptions): AnyExtension {
    return Link.configure(extensionOptions.native);
  }

  public async openCreateLinkDialog(): Promise<void> {
    if (!this.editor) return;

    const link = getLinkFromCursorPosition(this.editor);
    const position = getSelectedEditorTextPosition(this.editor);
    if (!position) return;

    this.createDialog = this.ngZone.run(() => this.dialogService.openPopover<string, LinkSelectionProps>(LinkSelectComponent, {
      width: 'auto',
      position: position.topCenter,
      autoClose: true,
      data: {
        link,
        inputPlaceholder: this.options.ng.inputPlaceholder as string
      }
    }));

    const result: ResultData<string> = await this.createDialog.result$.toPromise();
    this.createDialog = null;
    if (result.status === 'canceled') {
      this.editor.commands.focus();
      return;
    }

    const {from, to} = this.editor.state.selection;
    this.editor.chain().focus()
      .extendMarkRange('link')
      .unsetLink()
      .setLink({href: result.data!})
      .setTextSelection({from, to})
      .run();
  }

  public can(): boolean {
    if (!this.editor) return false;

    const active = this.isActive();
    const {from, to} = this.editor.state.selection;
    return !!this.editor?.can().setLink({href: ''}) && from !== to || from === to && active;
  }

  public isActive(): boolean {
    return !!this.editor && 'href' in this.editor.getAttributes('link');
  }

  private async toggleLinkPreview(editor: Editor): Promise<void> {
    if (
      // Link creation dialog is open
      this.createDialog ||
      // Not active
      !this.isActive() ||
      // Some text selected
      editor.view.state.selection.from !== editor.view.state.selection.to
    ) {
      return this.closeLinkPreview();
    }

    // Get the link and the anchor element
    const link = getLinkFromCursorPosition(this.editor);
    const linkElement = getLinkDOMFromCursorPosition(this.editor, link);
    // Not a link element
    if (!linkElement) {
      return this.closeLinkPreview();
    }

    // Already open and no different link element selected
    if (this.previewDialog && linkElement === this.linkElement) return;

    // Different link element, so close the preview and create a new dialog
    this.closeLinkPreview();
    this.linkElement = linkElement;
    const position = linkElement.getBoundingClientRect();
    const previewDialog = this.ngZone.run(() => this.dialogService.openPopover<'delete' | 'edit'>(LinkPreviewComponent, {
      position: {
        x: position.x + position.width / 2,
        y: position.y
      },
      data: link
    }));
    // Prevent race conditions from overwriting the preview dialog
    this.previewDialog = previewDialog;

    // Get result of dialog
    const result = await previewDialog.result$.toPromise();
    // Fixes race condition
    if (this.previewDialog === previewDialog) {
      this.closeLinkPreview();
    }

    if (result.data === 'delete') {
      this.editor.chain().focus().unsetLink().run();
    } else if (result.data === 'edit') {
      this.editor.commands.focus();
      await this.openCreateLinkDialog();
    }
  }

  private closeLinkPreview(): void {
    this.linkElement = null;
    if (this.previewDialog) {
      this.ngZone.run(() => this.previewDialog!.cancel());
      this.previewDialog = null;
    }
  }
}
