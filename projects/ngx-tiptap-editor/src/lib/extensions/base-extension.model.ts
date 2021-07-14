/**
 * Taken from ts-toolebelt
 */
import { BaseExtension } from './base-extension';

export type List<A = any> = ReadonlyArray<A>;

export type Class<P extends List = any[], R extends object = object> = new(...args: P) => R;

export type Instance<C extends Class> = C extends Class<any[], infer R> ? R : any;
export type Constructor<T = any> = new (...args: any[]) => T;

export interface ExtensionBuilder<O, E extends typeof BaseExtension & Class> {
  options: O;
  angularExtension: Constructor<E>;

  build(): Instance<E>;
}
