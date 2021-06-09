import { Component, forwardRef } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { getHeadingsExtension } from '../../../helpers';
import { HeadingLevel } from '../../../models/types';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-heading-control',
  styleUrls: ['_styles.scss'],
  template: `
    <tip-select [value]="getCurrentFormat()" placeholder="Text Format" (change)="selectTextLevel($event)">
      <tip-option value="paragraph">Paragraph</tip-option>
      <tip-option *ngFor="let level of levels" [value]="level">Heading {{level}}</tip-option>
    </tip-select>
  `,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => HeadingControlComponent)}],
})
export class HeadingControlComponent extends BaseControl {
  public levels: HeadingLevel[] = [];

  public setEditor(editor: Editor): void {
    super.setEditor(editor);
    this.levels = getHeadingsExtension(editor).options.levels;
  }

  public getCurrentFormat(): string | number | null {
    if (this.editor) {
      for (const level of this.levels) {
        if (this.editor.isActive('heading', {level})) return level;
      }
      if (this.editor.isActive('paragraph')) return 'paragraph';
    }
    return null;
  }

  public setParagraph(): void {
    this.editor && this.editor.chain().setParagraph().focus().run();
  }

  public setHeading(headingLevel: number): void {
    this.editor && this.editor.chain().focus().setHeading({level: headingLevel as HeadingLevel}).focus().run();
  }

  public selectTextLevel(event: any): void {
    if (typeof event === 'number') {
      this.setHeading(event);
    } else {
      this.setParagraph();
    }
  }
}
