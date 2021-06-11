import { ChangeDetectionStrategy, Component, forwardRef, Inject } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { DIALOG_DATA, DialogRef } from '../../dialog/dialog.helpers';
import { BaseControl } from './base-control';


@Component({
  selector: 'tip-link-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h4 class="no-margin light-font small-padding-bottom">Input your link</h4>
    <input class="tip-input" placeholder="Input link" tipAutofocus type="text" #e>
    <div class="align-right small-padding-top">
      <button class="tip-button" (click)="submit(e.value)">submit</button>
    </div>
  `
})
export class LinkSelectComponent {

  private urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;

  constructor(
    private dialogRef: DialogRef<string, string, LinkControlComponent>,
    @Inject(DIALOG_DATA) private link: string
  ) {
  }

  public submit(value: string): void {
    if (this.urlRegex.test(value)) {
      this.dialogRef.closeDialog(value);
    }
  }
}

// [class.active]="editor.isActive('link')"
@Component({
  selector: 'tip-link-control',
  styleUrls: ['_styles.scss'],
  template: `
    <button class="material-icons" (click)="openLinkDialog()" [class.disabled]="!can()">
      <div class="content-wrapper" #ref>
        <ng-content #ref></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">link</i>
    </button>
  `,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => LinkControlComponent)}],
})
export class LinkControlComponent extends BaseControl {
  constructor(
    private dialogService: DialogService
  ) {
    super();
  }

  public async openLinkDialog(): Promise<void> {
    if (!this.editor) return;

    const link = this.editor.getAttributes('link');
    const data = link.href ? link.href : null;

    const ref = this.dialogService.openDialog<string>(LinkSelectComponent, {width: 'auto', data});
    const result = await ref.result$.toPromise();
    if (result.status === 'canceled') return;

    this.editor.chain().focus().setLink({href: result.data}).focus().run();
  }

  public can(): boolean {
    if (!this.editor) return false;
    return this.editor.can().chain().setLink({href: ''}).run();
  }
}
