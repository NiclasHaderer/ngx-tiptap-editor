import { Component, forwardRef } from '@angular/core';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-link-control',
  template: `
    <div (click)="openLinkDialog()">link</div>`,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => LinkControlComponent)}],
})
export class LinkControlComponent extends BaseControl {
  public openLinkDialog(): void {
    this.editor && this.editor.chain().focus().setLink({href: 'https://youtube.com'}).focus().run();
  }
}
