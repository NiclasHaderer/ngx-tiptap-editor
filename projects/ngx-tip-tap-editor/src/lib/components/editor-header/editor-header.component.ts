import { Component } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { getHeadingsExtension } from '../../helpers';
import { HeadingLevel } from '../../models/types';

@Component({
  selector: 'tip-editor-header',
  templateUrl: './editor-header.component.html',
  styleUrls: ['./editor-header.component.scss'],
})
export class EditorHeaderComponent {
  public editor: Editor | null = null;
  public levels: HeadingLevel[] = [];

  public setEditor(tiptapEditor: Editor): void {
    this.editor = tiptapEditor;
    this.levels = getHeadingsExtension(this.editor).options.levels;
  }

  public toggleItalic(): void {
    this.editor && this.editor.chain().focus().toggleItalic().focus().run();
  }

  public toggleBold(): void {
    this.editor && this.editor.chain().focus().toggleBold().focus().run();
  }

  public toggleUnderline(): void {
    this.editor && this.editor.chain().focus().toggleUnderline().focus().run();
  }

  public toggleBulletList(): void {
    this.editor && this.editor.chain().focus().toggleBulletList().focus().run();
  }

  public setParagraph(): void {
    this.editor && this.editor.chain().setParagraph().focus().run();
  }

  public setHeading(headingLevel: number): void {
    this.editor && this.editor.chain().focus().setHeading({level: headingLevel as HeadingLevel}).focus().run();
  }

  public selectTextLevel(event: any): void {
    console.log(event);
    if (typeof event === 'number') {
      this.setHeading(event);
    } else {
      this.setParagraph();
    }
  }

}
