import type * as TipTap from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import type { Heading } from '@tiptap/extension-heading';
import type * as LinkExtension from '@tiptap/extension-link';
import type * as StarterKit from '@tiptap/starter-kit';
import type { Transaction } from 'prosemirror-state';
import type { loadCore } from '../tiptap-library-core';

export type TipTapModule = typeof TipTap;

export type TiptapLinkExtension = typeof LinkExtension;
export type TiptapLibraryCore = ReturnType<typeof loadCore>;
export type TipTapStarterKit = typeof StarterKit;

export type HeadingsExtension = typeof Heading;
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type EditorEvent = 'beforeCreate' | 'create' | 'update' | 'selectionUpdate' | 'transaction' | 'focus' | 'blur' | 'destroy';

export interface EditorEventReturn {
  beforeCreate: { editor: Editor; };
  create: { editor: Editor; };
  update: { editor: Editor; };
  selectionUpdate: { editor: Editor; };
  transaction: { editor: Editor; transaction: Transaction };
  focus: { editor: Editor, event: FocusEvent };
  blur: { editor: Editor, event: FocusEvent };
  destroy: {};
}

