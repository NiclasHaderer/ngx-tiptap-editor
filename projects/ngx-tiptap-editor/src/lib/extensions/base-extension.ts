import { Editor } from '@tiptap/core';
import { AnyExtension } from '@tiptap/core/src/types';
import { fromEditorEvent } from '../helpers';

type Constructor<T> = new (...args: any[]) => T;

export interface ExtensionBuilder<O, E extends BaseExtension<O>> {
  options: O;
  angularExtension: Constructor<E>;

  build(): BaseExtension<E>;
}

export interface BaseExtension<T> {
  editorInit(): void;
}

export abstract class BaseExtension<T> {
  // TODO
  public readonly nativeExtension: AnyExtension | undefined;

  protected constructor(protected editor: Editor) {
    fromEditorEvent(editor, 'create', true).toPromise().then(() => {
      this.editorInit && this.editorInit();
    });
  }

  public static create<E extends BaseExtension<any>>(
    extension: Constructor<E>,
    extensionOptions: Parameters<E['createExtension']>
  ): ExtensionBuilder<Parameters<E['createExtension']>, E> {
    return {
      options: extensionOptions,
      angularExtension: extension,
      build(): BaseExtension<E> {
        return new this.angularExtension();
      }
    };
  }

  public abstract createExtension(extensionOptions: T): AnyExtension;
}
