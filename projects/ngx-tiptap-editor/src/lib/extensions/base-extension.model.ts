import { Injector } from '@angular/core';
import { Editor } from '@tiptap/core';
import { C } from './ts-toolbelt';

export type Constructor<T = any> = new (...args: any[]) => T;

export interface ExtensionBuilder<O, E extends C.Class> {
  options: O;
  angularExtension: Constructor<E>;

  build(editor: Editor, injector: Injector): E;
}
