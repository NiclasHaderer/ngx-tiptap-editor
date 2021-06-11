import type { Extension, Mark } from '@tiptap/core';
import type { KeyboardShortcutCommand } from '@tiptap/core/dist/packages/core/src/types';
import { TiptapLinkExtension } from '../models/types';

type LibraryImport<T extends { default: Extension | Mark }> = () => Promise<T>;

export const customLinkFactory = async (linkExtension: LibraryImport<TiptapLinkExtension>) => {
  const extension = await linkExtension().then(e => e.default);
  return {
    default: extension.extend({
      addKeyboardShortcuts(): { [key: string]: KeyboardShortcutCommand } {
        return {
          'Mod-k': () => this.editor.commands.setLink({href: 'https://youtube.com'})
        };
      }
    })
  };
};

