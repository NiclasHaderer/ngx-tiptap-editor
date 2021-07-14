import { Injector } from '@angular/core';
import { C } from './ts-toolbelt';

export type Constructor<T = any> = new (...args: any[]) => T;

export interface ExtensionBuilder<O, E extends C.Class> {
  options: O;
  angularExtension: Constructor<E>;

  build(injector: Injector): E;
}
