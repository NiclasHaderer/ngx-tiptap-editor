import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '../dialog/dialog.helpers';
import { LinkControlComponent } from '../editor-header/controls/link-control.component';

// @dynamic
@Component({
  selector: 'tip-link-select',
  template: `
    <h4 class="no-margin light-font small-padding-bottom">{{data?.popupText}}</h4>
    <input class="tip-input" [placeholder]="data?.inputPlaceholder" tipAutofocus type="text" #input
           (keydown.enter)="submit(input.value, $event)">
    <br>
    <small style="color: var(--tip-warn-color)" *ngIf="error">{{error}}</small>
    <div class="align-right small-padding-top">
      <button type="button" (click)="submit(input.value)" class="tip-button">Submit</button>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkSelectComponent {
  public error: string | null = null;
  private urlRegex = new RegExp('^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
    '(\\#[-a-z\\d_]*)?$', 'i');

  constructor(
    private dialogRef: DialogRef<string, string, LinkControlComponent>,
    @Inject(DIALOG_DATA) public data: { link: string, popupText: string, inputPlaceholder: string }
  ) {
  }

  public submit(value: string, event?: Event): void {
    // Stop selected text being replaced by the enter
    event && event.preventDefault();

    if (!/^(https?:\/\/).*/.test(value)) value = `https://${value}`;

    if (this.urlRegex.test(value)) {
      this.dialogRef.submitDialog(value);
    } else {
      this.error = 'Invalid URL';
    }
  }
}
