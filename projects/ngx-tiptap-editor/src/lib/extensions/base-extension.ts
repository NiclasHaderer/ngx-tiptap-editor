import { Editor } from '@tiptap/core';
import { AnyExtension } from '@tiptap/core/src/types';
import { fromEditorEvent } from '../helpers';
import { Constructor, ExtensionBuilder, Instance } from './base-extension.model';


export interface BaseExtension<T> {
  editorInit(): void;
}

export abstract class BaseExtension<T> {
  // TODO
  public readonly nativeExtension: AnyExtension | undefined;

  constructor(protected editor: Editor) {
    fromEditorEvent(editor, 'create', true).toPromise().then(() => {
      this.editorInit && this.editorInit();
    });
  }

  public static create<E extends Constructor,
    O = Parameters<Instance<E>['createExtension']>[0]>(extension: E, extensionOptions: O): ExtensionBuilder<O, Instance<E>> {
    return {
      options: extensionOptions,
      angularExtension: extension,
      build(): Instance<E> {
        return new this.angularExtension();
      }
    };
  }

  public abstract createExtension(extensionOptions: T): AnyExtension;
}
