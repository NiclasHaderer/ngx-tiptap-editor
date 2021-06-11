import { Injectable, NgZone } from '@angular/core';
import type { Editor, Extension, Mark } from '@tiptap/core';
import { TiptapLibraryCore, TipTapModule, TipTapStarterKit } from '../models/types';
import { loadCore } from '../tiptap-library-core';


@Injectable({
  providedIn: 'root'
})
export class TiptapService {
  private tiptapCore: TiptapLibraryCore | null = null;

  constructor(
    private ngZone: NgZone
  ) {
  }

  async getEditor(editorElement: HTMLElement): Promise<Editor> {
    const tipTapModule = await this.getTipTap();
    return this.ngZone.runOutsideAngular(async () => {
      return new tipTapModule.Editor({
        element: editorElement,
        autofocus: false,
        extensions: await this.getExtensions(),
      });
    });
  }

  async getExtensions(): Promise<(Extension | Mark)[]> {
    const starterKit = await this.getTipTapStarterKit();
    const extensions = await this.loadExtensions();
    return [starterKit.default, ...extensions];
  }

  getTipTap(): Promise<TipTapModule> {
    return this.loadTiptapCore().then((CORE) => CORE.tiptapCore);
  }

  getTipTapStarterKit(): Promise<TipTapStarterKit> {
    return this.loadTiptapCore().then((CORE) => CORE.starterKit);
  }

  loadExtensions(): Promise<(Extension | Mark)[]> {
    return this.loadTiptapCore()
      .then((CORE) => Object.values(CORE.extensions))
      .then(eList => eList.map(e => e.default));
  }

  private loadTiptapCore(): TiptapLibraryCore {
    if (!this.tiptapCore) {
      this.tiptapCore = loadCore();
    }
    return this.tiptapCore;
  }
}
