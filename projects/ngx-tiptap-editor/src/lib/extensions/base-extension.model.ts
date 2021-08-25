import { Injector } from '@angular/core';
import { C } from '../models/utility-types';
import Instance = C.Instance;

export type Constructor<T = any> = new (...args: any[]) => T;

export interface ExtensionBuilder<O, E extends C.Class> {
  options: O;
  angularExtension: Constructor<E>;

  build(injector: Injector): Instance<E>;
}
