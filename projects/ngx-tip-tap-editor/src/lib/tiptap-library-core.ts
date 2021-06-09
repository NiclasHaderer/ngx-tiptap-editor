import * as tiptapCore from '@tiptap/core';
import * as link from '@tiptap/extension-link';
import * as textAlign from '@tiptap/extension-text-align';
import * as underline from '@tiptap/extension-underline';
import * as starterKit from '@tiptap/starter-kit';

export const CORE = {
  tiptapCore,
  starterKit,
  extensions: {
    underline,
    link,
    textAlign
  }
};
