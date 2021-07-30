import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
import { AnyExtension, Editor } from '@tiptap/core';
import { Link, LinkOptions } from '@tiptap/extension-link';
import { delay, filter, takeUntil, tap } from 'rxjs/operators';
import { DialogRef } from '../../components/dialog/dialog.helpers';
import { LinkPreviewComponent } from '../../components/link/preview';
import { LinkSelectComponent } from '../../components/link/selection';
import { asyncFilter, fromEditorEvent, sleep } from '../../helpers';
import { TipDialogService } from '../../services/dialog.service';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { BaseExtension } from '../base-extension';

export interface NgxLinkOptions extends Partial<LinkOptions> {
  popupText?: string;
  inputPlaceholder?: string;
}

// @dynamic
@Injectable()
export class NgxLink extends BaseExtension<NgxLinkOptions> {
  public defaultOptions: Partial<NgxLinkOptions> = {
    inputPlaceholder: 'Input link',
    popupText: 'Input your link',
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
    return Link.configure(extensionOptions);
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
    ).subscribe(({editor: e}) => this.openLinkPreview(e));

    fromEditorEvent(this.editor, 'blur').pipe(
      filter(() => !!this.tooltipRef),
      delay(500),
      takeUntil(this.destroy$),
    ).subscribe(() => this.closeLinkPreview());
  }

  public onEditorDestroy(): any {
    super.onEditorDestroy();
    this.closeLinkPreview();
    this.dialogRef?.cancelDialog();
  }

  public async openLinkDialog(): Promise<void> {
    if (!this.editor) return;

    const link = this.editor.getAttributes('link');
    const data = link.href ? link.href : null;

    this.dialogRef = this.ngZone.run(() => this.dialogService.openDialog<string>(LinkSelectComponent, {
      width: 'auto', data: {
        link: data,
        popupText: this.options.popupText,
        inputPlaceholder: this.options.inputPlaceholder
      }
    }));
    const result = await this.dialogRef.result$.toPromise();
    if (result.status === 'canceled') return;

    this.editor.chain().focus().setLink({href: result.data}).run();
  }

  public async can(): Promise<boolean> {
    return this.ngZone.runOutsideAngular(async () => {
      await sleep(0);
      if (!this.editor) return false;

      const selection = this.editor.state.selection;
      if (selection.from === selection.to) return false;

      return !!this.editor?.can().setLink({href: ''}) && !this.isActive();
    });
  }

  public isActive(): boolean {
    return !!this.editor && 'href' in this.editor.getAttributes('link');
  }

  private async openLinkPreview(editor: Editor): Promise<void> {
    if (
      // Not active
      !this.isActive() ||
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
    const tooltipRef = this.ngZone.run(() => this.dialogService.openPopover(LinkPreviewComponent, {
      position: {
        x: position.x + position.width / 2,
        y: position.y
      },
      data: link
    }));
    this.tooltipRef = tooltipRef;

    const result = await this.tooltipRef.result$.toPromise();
    if (result.data === 'delete' && this.editor) this.editor.chain().focus().unsetLink().run();
    this.closeLinkPreview(tooltipRef);
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
    if (newLinkElement.tagName !== 'A') newLinkElement = startElement.querySelector(linkSelector);

    if (!newLinkElement) newLinkElement = startElement.closest(linkSelector);
    if (!newLinkElement) return null;
    return newLinkElement as HTMLAnchorElement;
  }

  private closeLinkPreview(tooltipRef = this.tooltipRef): void {
    if (tooltipRef) {
      this.ngZone.run(() => {
        tooltipRef!.cancelDialog();
        tooltipRef = null;
      });
    }
  }
}
