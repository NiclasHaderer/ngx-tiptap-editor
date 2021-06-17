import { Injectable, NgZone } from '@angular/core';
import type { Editor, EditorOptions } from '@tiptap/core';
import { TiptapLibraryCore, TipTapModule } from '../models/types';
import { loadCore } from '../tiptap-library-core';


@Injectable({
  providedIn: 'root'
})
export class TiptapService {
  private tiptapCore: TiptapLibraryCore | null = null;

  constructor(
    private ngZone: NgZone,
  ) {
  }

  async getEditor(editorElement: HTMLElement, options: Partial<EditorOptions> = {}): Promise<Editor> {
    const tipTapModule = await this.getTipTap();
    return this.ngZone.runOutsideAngular(async () => {
      return new tipTapModule.Editor({
        ...options,
        element: editorElement,
      });
    });
  }


  public getTipTap(): Promise<TipTapModule> {
    return this.loadTiptapCore().then((CORE) => CORE.tiptapCore);
  }

  private loadTiptapCore(): TiptapLibraryCore {
    if (!this.tiptapCore) {
      this.tiptapCore = loadCore();
    }
    return this.tiptapCore;
  }
}
