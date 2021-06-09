import { Component, forwardRef } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { getHeadingsExtension } from '../../../helpers';
import { HeadingLevel } from '../../../models/types';
import { BaseControl } from './base-control';

@Component({
  selector: 'tip-heading-control',
  styleUrls: ['_styles.scss'],
  template: `
    <tip-select (change)="selectTextLevel($event)">
      <tip-option text="Normal" value="normal" [selected]="editor?.isActive('paragraph')"></tip-option>
      <tip-option *ngFor="let level of levels" [text]="'Heading ' + level"
                  [selected]="editor?.isActive('heading', {level: level})" [value]="level"></tip-option>
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
