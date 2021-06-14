import type { Editor } from '@tiptap/core';
import { Observable, OperatorFunction } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { EditorEvent, HeadingsExtension } from './models/types';


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

export const fromEditorEvent = (editor: Editor, event: EditorEvent): Observable<any> => {
  return new Observable((observer) => {
    const callback = (...params: any[]) => {
      observer.next(params);
    };
    editor.on(event, callback);

    return () => {
      editor.off(event, callback);
    };
  });
};
