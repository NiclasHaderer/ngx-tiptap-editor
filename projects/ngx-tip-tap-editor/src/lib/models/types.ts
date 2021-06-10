import type * as TipTap from '@tiptap/core';
import type { Editor } from '@tiptap/core';
import { Heading } from '@tiptap/extension-heading';
import type * as UnderLine from '@tiptap/extension-underline';
import type * as StarterKit from '@tiptap/starter-kit';
import type { Transaction } from 'prosemirror-state';
import type { loadCore } from '../tiptap-library-core';

export type TipTapModule = typeof TipTap;

export type TiptapLibraryCore = ReturnType<typeof loadCore>;
export type TipTapStarterKit = typeof StarterKit;
export type TipTapUnderlineExtension = typeof UnderLine;

export type OnChangeUpdate = { editor: Editor, transaction: Transaction };

export type HeadingsExtension = typeof Heading;
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
