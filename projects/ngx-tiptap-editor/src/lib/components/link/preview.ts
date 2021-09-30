import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DialogRef, TIP_DIALOG_DATA } from '../dialog/dialog.helpers';

@Component({
  selector: 'tip-link-preview',
  template: `
    <div class="flex">
      <a class="v-center link-text" target="_blank" [href]="link">
        {{link}}
      </a>
      <i style="padding: 0 .25rem" class="material-icons pointer" tabindex="0" (click)="deleteLink()"
         (keyup.enter)="deleteLink()">link_off</i>
      <i style="padding: 0 .25rem" class="material-icons pointer" tabindex="0" (click)="copyLink()"
         (keyup.enter)="copyLink()">content_copy</i>
      <i style="padding: 0 .25rem" class="material-icons pointer" tabindex="0" (click)="editLink()"
         (keyup.enter)="editLink()">edit</i>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkPreviewComponent {
  constructor(
    private dialogRef: DialogRef<string, string, LinkPreviewComponent>,
    @Inject(TIP_DIALOG_DATA) public link: string
  ) {
  }

  public deleteLink(): void {
    this.dialogRef.submit('delete');
  }

  public editLink(): void {
    this.dialogRef.submit('edit');
  }

  public async copyLink(): Promise<void> {
    await navigator.clipboard.writeText(this.link);
    this.dialogRef.cancel();
  }
}
