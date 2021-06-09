import type { Editor } from '@tiptap/core';

export abstract class BaseControl {
  private _editor: Editor | null = null;
  public get editor(): Editor | null {
    return this._editor;
  }

  public setEditor(editor: Editor): void {
    this._editor = editor;
  }
}
