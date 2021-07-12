import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Inject, Input, NgZone, OnDestroy } from '@angular/core';
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
    <button type="button" (click)="openLinkDialog()" disabled #button>
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">link</i>
    </button>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => LinkControlComponent)}],
})
export class LinkControlComponent extends ButtonBaseControl implements OnDestroy {
  @Input() popupText = 'Input your link';
  @Input() inputPlaceholder = 'Input link';

  private dialogRef: DialogRef<any, any, any> | null = null;
  private tooltipRef: DialogRef<any, any, any> | null = null;
  private linkElement: HTMLAnchorElement | null = null;

  constructor(
    private dialogService: DialogService,
    protected eventService: TiptapEventService,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    this.closeLinkPreview();
    this.dialogRef?.cancelDialog();
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

    this.dialogRef = this.ngZone.run(() => this.dialogService.openDialog<string>(LinkSelectComponent, {
      width: 'auto', data: {
        link: data,
        popupText: this.popupText,
        inputPlaceholder: this.inputPlaceholder
      }
    }));
    const result = await this.dialogRef.result$.toPromise();
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
    console.log('preview');
    if (
      // Not active
      !this.isActive() ||
      // Text selection
      editor.view.state.selection.from !== editor.view.state.selection.to
    ) {
      return this.closeLinkPreview();
    }

    // Get the link and the style of the anchor element
    const link: string | null = editor.getAttributes('link').href;

    const linkElement = this.getLinkElement(link);
    if (!linkElement) return this.closeLinkPreview();

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
