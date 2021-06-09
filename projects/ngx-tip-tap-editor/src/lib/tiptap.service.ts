import { Injectable } from '@angular/core';
import type { Editor, Extension, Mark } from '@tiptap/core';
import { TiptapLibraryCore, TipTapModule, TipTapStarterKit } from './models/types';


@Injectable({
  providedIn: 'root'
})
export class TiptapService {
  private tiptapCore: Promise<any> | null = null;

  async getEditor(editorElement: HTMLElement): Promise<Editor> {
    const tipTapModule = await this.getTipTap();
    return new tipTapModule.Editor({
      element: editorElement,
      extensions: await this.getExtensions()
    });
  }

  async getExtensions(): Promise<(Extension | Mark)[]> {
    const starterKit = await this.getTipTapStarterKit();
    const extensions = await this.loadExtensions();
    return [starterKit.default, ...extensions];
  }

  getTipTap(): Promise<TipTapModule> {
    return this.loadTiptapCore().then(({CORE}) => CORE.tiptapCore);
  }

  getTipTapStarterKit(): Promise<TipTapStarterKit> {
    return this.loadTiptapCore().then(({CORE}) => CORE.starterKit);
  }

  loadExtensions(): Promise<any[]> {
    return this.loadTiptapCore()
      .then(({CORE}) => Object.values(CORE.extensions))
      .then(eList => eList.map(e => e.default));
  }

  private loadTiptapCore(): Promise<TiptapLibraryCore> {
    if (!this.tiptapCore) {
      this.tiptapCore = import('./tiptap-library-core');
    }
    return this.tiptapCore;
  }
}
