import * as extensionLink from '@tiptap/extension-link';
import * as textAlign from '@tiptap/extension-text-align';
import * as underline from '@tiptap/extension-underline';
import * as starterKit from '@tiptap/starter-kit';

extensionLink.Link.options.openOnClick = false;

const LAZY_EXTENSIONS = [starterKit, underline, extensionLink, textAlign];
export default LAZY_EXTENSIONS;
