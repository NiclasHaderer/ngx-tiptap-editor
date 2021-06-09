import type { Editor } from '@tiptap/core';
import { HeadingsExtension } from './models/types';


const findExtension = (editor: Editor, name: string) => {
  return editor.extensionManager.extensions.find(e => e.name === name);
};

export const getHeadingsExtension = (editor: Editor): HeadingsExtension => {
  return findExtension(editor, 'heading') as HeadingsExtension;
};

