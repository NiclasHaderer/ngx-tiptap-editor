import type { Editor } from '@tiptap/core';
import { from, MonoTypeOperatorFunction, Observable, pipe } from 'rxjs';
import { concatMap, filter, map } from 'rxjs/operators';
import { EditorEvent, EditorEventReturn, HeadingsExtension } from './models/types';


const findExtension = (editor: Editor, name: string) => {
  return editor.extensionManager.extensions.find(e => e.name === name);
};

export const getHeadingsExtension = (editor: Editor): HeadingsExtension => {
  return findExtension(editor, 'heading') as HeadingsExtension;
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fromEditorEvent = <T extends EditorEvent>(editor: Editor, event: T, once = false): Observable<EditorEventReturn[T]> => {
  return new Observable<any>((observer) => {
    const callback = (...params: any[]) => {
      observer.next(...params);
      if (once) editor.off(event, callback);
    };
    editor.on(event, callback);

    return () => {
      editor.off(event, callback);
    };
  });
};

export const asyncFilter = <T>(predicate: (value: T, index: number) => Promise<boolean>): MonoTypeOperatorFunction<T> => {
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
};

export const getSelectedTextPosition = (): null | DOMRect => {
  const selection = document.getSelection();
  if (!selection) return null;
  const range = selection.getRangeAt(0);
  return range.getBoundingClientRect();
};

export const topCenterOfRect = (rect: DOMRect): { x: number; y: number } => {
  return {
    y: rect.y,
    x: rect.x + rect.width / 2
  };
};

export const getDuplicates = <T>(list: T[], getKey: (item: T) => string): { [key: string]: T[] } | null => {
  const hashMap: Record<string, T[]> = {};
  for (const item of list) {
    const key = getKey(item);
    if (!(key in hashMap)) hashMap[key] = [];
    hashMap[key].push(item);
  }

  const duplicates: Record<string, T[]> = {};
  for (const hashKey of Object.keys(hashMap)) {
    if (hashMap[hashKey].length > 1) duplicates[hashKey] = hashMap[hashKey];
  }

  return Object.keys(duplicates).length > 0 ? duplicates : null;
};

export const isObject = (o: any): boolean => typeof o === 'object' && !Array.isArray(o);

export const deepMerge = <T extends Record<string | number, any>>(target: T, source: Record<any, any>): T => {
  const targetCopy: Record<string | number, any> = {...target};
  for (const key of Object.keys(source)) {

    if (isObject(source[key])) {
      const newTarget = isObject(target[key]) ? target[key] : {};
      targetCopy[key] = deepMerge(newTarget, source[key]);
    } else {
      targetCopy[key] = source[key];
    }
  }
  return targetCopy as T;
};
