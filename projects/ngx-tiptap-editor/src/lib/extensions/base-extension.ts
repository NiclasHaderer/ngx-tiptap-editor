import { Injector } from '@angular/core';
import { Editor } from '@tiptap/core';
import { AnyExtension } from '@tiptap/core/src/types';
import { fromEditorEvent } from '../helpers';
import { Constructor, ExtensionBuilder, Instance } from './base-extension.model';

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

        const i = Injector.create({
          providers: [{
            provide: this.angularExtension
          }]
        });

        const e = i.get(this.angularExtension);
        e.options = this.options;
        e.nativeExtension = e.createExtension(this.options);
        return e;
      }
    };
  }

  public abstract createExtension(extensionOptions: T): AnyExtension;
}
