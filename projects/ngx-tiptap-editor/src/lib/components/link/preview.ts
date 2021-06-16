import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { DIALOG_DATA, DialogRef } from '../dialog/dialog.helpers';

@Component({
  selector: 'tip-link-preview',
  template: `
    <div class="flex">
      <a class="v-center link-text" target="_blank" [href]="link">
        {{link}}
      </a>
      <i class="material-icons pointer" (click)="deleteLink()">delete</i>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinkPreviewComponent {
  constructor(
    private dialogRef: DialogRef<string, string, LinkPreviewComponent>,
    @Inject(DIALOG_DATA) public link: string
  ) {
  }

  public deleteLink(): void {
    this.dialogRef.closeDialog('delete');
  }
}
