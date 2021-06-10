import { Component, forwardRef } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { getHeadingsExtension } from '../../../helpers';
import { HeadingLevel } from '../../../models/types';
import { BaseControl } from './base-control';

const isHeading = (level: number | string): level is HeadingLevel => typeof level === 'number';

@Component({
  selector: 'tip-format-control',
  styleUrls: ['_styles.scss'],
  template: `
    <tip-select [value]="getCurrentFormat()" placeholder="Text Format" (change)="selectTextLevel($event)"
                defaultValue="paragraph">
      <tip-option value="paragraph" [disabled]="cannotStyle('paragraph')">Paragraph</tip-option>
      <tip-option *ngFor="let level of levels" [value]="level" [disabled]="cannotStyle(level)">
        <div [innerHTML]="buildHeadingHtml(level)"></div>
      </tip-option>
    </tip-select>
  `,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => FormatControlComponent)}],
})
export class FormatControlComponent extends BaseControl {
  public levels: HeadingLevel[] = [];

  public setEditor(editor: Editor): void {
    super.setEditor(editor);
    this.levels = getHeadingsExtension(editor).options.levels;
  }

  public getCurrentFormat(): string | number | null {
    if (this.editor) {
      const headingAttributes = this.editor.getAttributes('heading');
      if (headingAttributes.level) return headingAttributes.level;
      if (this.editor.isActive('paragraph')) return 'paragraph';
    }
    return null;
  }

  public setParagraph(): void {
    this.editor && this.editor.chain().setParagraph().focus().run();
  }

  public setHeading(headingLevel: HeadingLevel): void {
    this.editor && this.editor.chain().focus().setHeading({level: headingLevel}).focus().run();
  }

  public selectTextLevel(format: number | string): void {
    if (isHeading(format)) {
      this.setHeading(format);
    } else {
      this.setParagraph();
    }
  }

  public buildHeadingHtml(level: HeadingLevel): string {
    return `<h${level} class="no-margin light-font">Heading ${level}</h${level}>`;
  }

  public cannotStyle(format: number | string): boolean {
    if (!this.editor) return true;
    if (isHeading(format)) {
      return !this.editor.can().chain().focus().setHeading({level: format}).run();
    } else {
      return !this.editor.can().chain().focus().setParagraph().run();
    }
  }
}
