import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { AnyExtension, Editor } from '@tiptap/core';
import { Link, LinkOptions } from '@tiptap/extension-link';
import { filter, takeUntil, tap } from 'rxjs/operators';
import { DialogRef, ResultData } from '../../components/dialog/dialog.helpers';
import { LinkPreviewComponent } from '../../components/link/preview';
import { LinkSelectComponent, LinkSelectionProps } from '../../components/link/selection';
import { asyncFilter, fromEditorEvent, getSelectedTextPosition, sleep, topCenterOfRect } from '../../helpers';
import { TipDialogService } from '../../services/dialog.service';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { TipBaseExtension } from '../tip-base-extension';

export interface NgxLinkOptions {
  native: Partial<LinkOptions>;
  ng: Partial<{
    popupText: string;
    inputPlaceholder: string;
  }>;
}

// @dynamic
@Injectable()
export class NgxLink extends TipBaseExtension<NgxLinkOptions> {
  public defaultOptions: Partial<NgxLinkOptions> = {
    ng: {
      inputPlaceholder: 'Input link',
      popupText: 'Input your link',
    }
  };
  private dialogRef: DialogRef<any, any, any> | null = null;
  private tooltipRef: DialogRef<any, any, any> | null = null;
  private linkElement: HTMLAnchorElement | null = null;

  constructor(
    private dialogService: TipDialogService,
    protected eventService: TiptapEventService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  public createExtension(extensionOptions: NgxLinkOptions): AnyExtension {
    return Link.configure(extensionOptions.native);
  }

  public onEditorReady(): void {
    this.eventService.registerShortcut('Mod-k')
      .pipe(
        tap((e) => e.preventDefault()),
        asyncFilter(() => this.can()),
        takeUntil(this.destroy$),
      )
      .subscribe((e) => {
        e.preventDefault();
        this.openLinkDialog().then();
      });

    fromEditorEvent(this.editor, 'transaction').pipe(
      takeUntil(this.destroy$),
      filter(e => !e.transaction.getMeta('blur')),
    ).subscribe(({editor: e}) => this.toggleLinkPreview(e));
  }

  public onEditorDestroy(): void {
    this.closeLinkPreview();
    this.dialogRef?.cancel();
  }

  public async openLinkDialog(): Promise<void> {
    if (!this.editor) return;

    const link = this.editor.getAttributes('link');
    const data = link.href ? link.href : null;

    const rect = getSelectedTextPosition();
    if (!rect) return;
    const position = topCenterOfRect(rect);

    this.dialogRef = this.ngZone.run(() => this.dialogService.openPopover<string, LinkSelectionProps>(LinkSelectComponent, {
      width: 'auto',
      position,
      autoClose: true,
      data: {
        link: data,
        popupText: this.options.ng.popupText as string,
        inputPlaceholder: this.options.ng.inputPlaceholder as string
      }
    }));

    const result: ResultData<string> = await this.dialogRef.result$.toPromise();
    if (result.status === 'canceled') return;

    const {from, to} = this.editor.state.selection;
    this.editor.chain().focus().extendMarkRange('link').run();
    this.editor.chain().focus().unsetLink();
    this.editor.chain().focus().setLink({href: result.data!}).run();
    this.editor.chain().focus().setTextSelection({from, to}).run();
  }

  public async can(): Promise<boolean> {
    return this.ngZone.runOutsideAngular(async () => {
      if (!this.editor) return false;


      const active = await this.isActive();
      const {from, to} = this.editor.state.selection;
      return !!this.editor?.can().setLink({href: ''}) && from !== to
        || from === to && active;
    });
  }

  public isActive(): Promise<boolean> {
    return this.ngZone.runOutsideAngular(async () => {
      await sleep(100);
      return !!this.editor && 'href' in this.editor.getAttributes('link');
    });
  }

  private async toggleLinkPreview(editor: Editor): Promise<void> {
    if (
      // Not active
      !await this.isActive() ||
      // Text selection
      editor.view.state.selection.from !== editor.view.state.selection.to
    ) {
      this.linkElement = null;
      return this.closeLinkPreview();
    }

    // Get the link and the style of the anchor element
    const link: string | null = editor.getAttributes('link').href;

    const linkElement = this.getLinkElement(link);
    if (!linkElement) {
      this.linkElement = null;
      return this.closeLinkPreview();
    }

    // Already open and no different link element selected
    if (this.tooltipRef && linkElement === this.linkElement) return;

    this.closeLinkPreview();
    this.linkElement = linkElement;
    const position = linkElement.getBoundingClientRect();
    const tooltipRef = this.ngZone.run(() => this.dialogService.openPopover<'delete' | 'edit'>(LinkPreviewComponent, {
      position: {
        x: position.x + position.width / 2,
        y: position.y
      },
      data: link
    }));

    this.tooltipRef = tooltipRef;

    const result = await tooltipRef.result$.toPromise();
    this.linkElement = null;
    this.closeLinkPreview(tooltipRef);
    if (result.data === 'delete') {
      this.editor.chain().focus().unsetLink().run();
    } else if (result.data === 'edit') {
      this.editor.commands.focus();
      await sleep(0);
      await this.openLinkDialog();
    }
  }

  private getLinkElement(link: string | null): HTMLAnchorElement | null {
    let linkSelector = 'a';
    if (link) linkSelector = `a[href="${link}"]`;

    // Get current selection
    const selection = this.document.getSelection();

    // Check if the link element can be found
    if (!selection || !selection.anchorNode || !selection.anchorNode.parentElement) return null;

    // Get the link element and query for it if the parent node is not a link
    const startElement: HTMLElement = selection.anchorNode.parentElement;
    let newLinkElement: null | HTMLElement = startElement;


    // Selected element is not a link
    if (newLinkElement.tagName !== 'A') {
      // Try to find link in descendents
      newLinkElement = startElement.querySelector(linkSelector);

      if (!newLinkElement) {
        // Try to find link in parent
        newLinkElement = startElement.closest(linkSelector);
        if (!newLinkElement) return null;
      }
    }
    return newLinkElement as HTMLAnchorElement;
  }

  private closeLinkPreview(tooltipRef = this.tooltipRef): void {
    if (tooltipRef && !tooltipRef.done) {
      this.ngZone.run(() => tooltipRef!.cancel());
      this.tooltipRef = null;
    }
  }
}
