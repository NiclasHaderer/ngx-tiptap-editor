import { Editor, Extension } from '@tiptap/core';
import { fromEditorEvent } from '../helpers';

export interface BaseExtension {
  editorInit(): void;
}

export abstract class BaseExtension {
  public abstract nativeExtension: Extension;

  protected constructor(protected editor: Editor) {
    fromEditorEvent(editor, 'create', true).toPromise().then(() => {
      this.editorInit && this.editorInit();
    });
  }
}
