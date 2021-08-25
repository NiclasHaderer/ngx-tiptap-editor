import type * as TipTap from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import type { Heading } from '@tiptap/extension-heading';
import type * as LinkExtension from '@tiptap/extension-link';
import type * as TaskListExtension from '@tiptap/extension-task-list';
import type * as TextAlignExtension from '@tiptap/extension-text-align';
import type * as UnderlineExtension from '@tiptap/extension-underline';
import type * as StarterKit from '@tiptap/starter-kit';
import type { Transaction } from 'prosemirror-state';

export type TipTapModule = typeof TipTap;

// Declare the types of the extensions to get autocomplete for the editor
export type TiptapLinkExtension = typeof LinkExtension;
export type TiptapTextAlignExtension = typeof TextAlignExtension;
export type TipTapStarterKit = typeof StarterKit;
export type TipTapUnderlineExtension = typeof UnderlineExtension;
export type TipTapTaskListExtension = typeof TaskListExtension;

export type HeadingsExtension = typeof Heading;
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type EditorEvent =
  'beforeCreate'
  | 'create'
  | 'update'
  | 'selectionUpdate'
  | 'transaction'
  | 'focus'
  | 'blur'
  | 'destroy';

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

