import { customLinkFactory } from './extensions/extenden-link';

export const loadCore = async () => ({
  tiptapCore: await import('@tiptap/core'),
  starterKit: await import('@tiptap/starter-kit'),
  extensions: {
    underline: await import('@tiptap/extension-underline'),
    link: await customLinkFactory(() => import('@tiptap/extension-link')),
    textAlign: await import('@tiptap/extension-text-align')
  }
});
