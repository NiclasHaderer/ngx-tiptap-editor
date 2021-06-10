export const loadCore = async () => ({
  tiptapCore: await import('@tiptap/core'),
  starterKit: await import('@tiptap/starter-kit'),
  extensions: {
    underline: await import('@tiptap/extension-underline'),
    link: await import('@tiptap/extension-link'),
    textAlign: await import('@tiptap/extension-text-align')
  }
});
