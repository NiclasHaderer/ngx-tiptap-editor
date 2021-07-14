/**
 * Taken from ts-toolbelt
 * https://github.com/millsp/ts-toolbelt
 */

// tslint:disable-next-line:no-namespace
export namespace C {

  export type List<A = any> = ReadonlyArray<A>;

  export type Class<P extends List = any[], R extends object = object> = new (...args: P) => R;

  export type Instance<CLASS extends Class> = CLASS extends Class<any[], infer R> ? R : any;
}
