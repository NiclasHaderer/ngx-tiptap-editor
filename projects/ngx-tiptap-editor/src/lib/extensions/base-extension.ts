import { Injector } from '@angular/core';
import { AnyExtension, Editor } from '@tiptap/core';
import { Constructor, ExtensionBuilder } from './base-extension.model';
import { C } from './ts-toolbelt';

export interface BaseExtension<T> {
  editorInit(): void;
}

export abstract class BaseExtension<T> {
  private _nativeExtension!: AnyExtension;
  public set nativeExtension(value: AnyExtension) {
    if (this._nativeExtension) {
      console.warn(`${this.constructor.name} already has a nativeExtension assigned to it.`,
        `Don't try to assign it twice`);
      return;
    }
    this._nativeExtension = value;
  }

  public get nativeExtension(): AnyExtension {
    return this._nativeExtension;
  }

  private _options!: T;
  public set options(value: T) {
    if (this._options) {
      console.warn(`${this.constructor.name} already has the options set. Don't try to set it twice.`);
      return;
    }
    this._options = value;
  }

  public get options(): T {
    return this._options;
  }

  private _editor!: Editor;
  public set editor(value: Editor) {
    if (this._editor) {
      console.warn(`${this.constructor.name} already has the editor set. Don't try to set it twice.`);
      return;
    }
    this._editor = value;
  }

  public get editor(): Editor {
    return this._editor;
  }

  public static create<EXTENSION extends Constructor, OPTIONS = Parameters<C.Instance<EXTENSION>['createExtension']>[0]>(
    extension: EXTENSION,
    extensionOptions: OPTIONS
  ): ExtensionBuilder<OPTIONS, C.Instance<EXTENSION>> {
    return {
      options: extensionOptions,
      angularExtension: extension,
      build(editor: Editor, parentInjector: Injector): C.Instance<EXTENSION> {

        const injector2 = Injector.create({
          providers: [{provide: this.angularExtension}],
          parent: parentInjector
        });

        const injectedExtension = injector2.get(this.angularExtension);
        injectedExtension.options = this.options;
        injectedExtension.editor = editor;
        injectedExtension.nativeExtension = injectedExtension.createExtension(this.options);
        injectedExtension.editorInit && injectedExtension.editorInit();
        return injectedExtension;
      }
    };
  }

  public abstract createExtension(extensionOptions: T): AnyExtension;
}
