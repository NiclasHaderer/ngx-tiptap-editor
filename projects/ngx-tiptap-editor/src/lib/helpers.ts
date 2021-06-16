import type { Editor } from '@tiptap/core';
import { from, MonoTypeOperatorFunction, Observable, OperatorFunction, pipe } from 'rxjs';
import { concatMap, filter, map, tap } from 'rxjs/operators';
import { EditorEvent, EditorEventReturn, HeadingsExtension } from './models/types';


const findExtension = (editor: Editor, name: string) => {
  return editor.extensionManager.extensions.find(e => e.name === name);
};

export const getHeadingsExtension = (editor: Editor): HeadingsExtension => {
  return findExtension(editor, 'heading') as HeadingsExtension;
};

export const newUIntArrives: OperatorFunction<number, number> = source => {
  let last = -1;
  return source.pipe(
    filter(num => num !== last),
    tap(num => last = num),
  );
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fromEditorEvent = <T extends EditorEvent>(editor: Editor, event: T): Observable<EditorEventReturn[T]> => {
  return new Observable<any>((observer) => {
    const callback = (...params: any[]) => {
      observer.next(...params);
    };
    editor.on(event, callback);

    return () => {
      editor.off(event, callback);
    };
  });
};

export function asyncFilter<T>(predicate: (value: T, index: number) => Promise<boolean>): MonoTypeOperatorFunction<T> {
  let count = 0;
  return pipe(
    // Convert the predicate Promise<boolean> to an observable (which resolves the promise,
    // Then combine the boolean result of the promise with the input data to a container object
    concatMap((data: T) => {
      return from(predicate(data, count++))
        .pipe(map((isValid) => ({filterResult: isValid, entry: data})));
    }),
    // Filter the container object synchronously for the value in each data container object
    filter(data => data.filterResult),
    // remove the data container object from the observable chain
    map(data => data.entry)
  );
}
