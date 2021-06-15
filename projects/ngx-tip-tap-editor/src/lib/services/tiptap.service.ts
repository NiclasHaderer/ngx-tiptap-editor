import { Inject, Injectable, NgZone } from '@angular/core';
import type { Editor, EditorOptions, Extension, Mark } from '@tiptap/core';
import { ExtensionLoader, TIP_TAP_EXTENSIONS } from '../extensions/extension-loader-factory';
import { TiptapLibraryCore, TipTapModule } from '../models/types';
import { loadCore } from '../tiptap-library-core';


@Injectable({
  providedIn: 'root'
})
export class TiptapService {
  private tiptapCore: TiptapLibraryCore | null = null;
  private extensionPromise: Promise<(Mark | Extension)[]> | null = null;

  constructor(
    private ngZone: NgZone,
    @Inject(TIP_TAP_EXTENSIONS) private extensionLoader: ExtensionLoader
  ) {
  }

  async getEditor(editorElement: HTMLElement, options: Partial<EditorOptions> = {}): Promise<Editor> {
    const tipTapModule = await this.getTipTap();
    return this.ngZone.runOutsideAngular(async () => {
      return new tipTapModule.Editor({
        ...options,
        element: editorElement,
        extensions: await this.getExtensions(),
      });
    });
  }

  public getExtensions(): Promise<(Mark | Extension)[]> {
    if (!this.extensionPromise) {
      this.extensionPromise = this.extensionLoader.load();
    }
    return this.extensionPromise;
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
