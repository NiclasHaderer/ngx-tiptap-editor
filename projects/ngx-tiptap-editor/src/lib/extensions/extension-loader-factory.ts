import { InjectionToken } from '@angular/core';
import type { Extension, Mark } from '@tiptap/core';

export const TIP_TAP_EXTENSIONS = new InjectionToken<ExtensionLoaderFactory>('TIP_TAP_EXTENSIONS');

export type LibraryImport = () => Promise<{ default: ({default: (Extension | Mark)})[] }>;

export type ExtensionLoader = ReturnType<typeof extensionLoaderFactory>;
export type ExtensionLoaderFactory = typeof extensionLoaderFactory;

export const extensionLoaderFactory = (promiseExtensionList: LibraryImport) => ({
  load: () => promiseExtensionList()
    .then(e => e.default)
    .then(extensionList => extensionList.map(e => e.default))
});
