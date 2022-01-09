import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DialogRef, TIP_DIALOG_DATA } from '../dialog/dialog.helpers';
import { ControlLinkComponent } from '../controls/control-link.component';


export interface LinkSelectionProps {
  link?: string;
  inputPlaceholder: string;
}

// @dynamic
@Component({
  selector: 'tip-link-select',
  template: `
    <div class="flex">
      <input class="tip-input" [placeholder]="data?.inputPlaceholder" tipAutofocus type="text" #input
             [value]="data.link"
             (keyup.enter)="submit(input.value, $event)">
      <button type="button" (click)="submit(input.value)" (keyup.enter)="submit(input.value)"
              class="tip-button margin-left-s">Apply
      </button>
    </div>
    <small style="color: var(--tip-warn-color)" *ngIf="error">{{error}}</small>
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
    private dialogRef: DialogRef<string, string, ControlLinkComponent>,
    @Inject(TIP_DIALOG_DATA) public data: { link: string, popupText: string, inputPlaceholder: string },
  ) {
  }

  public submit(value: string, event?: Event): void {
    // Stop selected text being replaced by the enter
    event && event.preventDefault();

    if (!/^(https?:\/\/).*/.test(value)) value = `https://${value}`;

    if (this.urlRegex.test(value)) {
      this.dialogRef.submit(value);
    } else {
      this.error = 'Invalid URL';
    }
  }
}
