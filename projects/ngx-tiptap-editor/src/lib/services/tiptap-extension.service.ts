import { Injectable } from '@angular/core';
import { AnyExtension } from '@tiptap/core';
import { BaseExtension } from '../extensions/base-extension';

@Injectable({
  providedIn: 'root'
})
export class TiptapExtensionService {
  private _nativeExtensions: Record<string, AnyExtension> = {};
  private _angularExtensions: Record<string, BaseExtension<any>> = {};

  public get angularExtensions(): Record<string, BaseExtension<any>> {
    return this._angularExtensions;
  }

  public set angularExtensions(value: Record<string, BaseExtension<any>>) {
    this._angularExtensions = value;
  }

  public get nativeExtensions(): Record<string, AnyExtension> {
    return this._nativeExtensions;
  }

  public set nativeExtensions(value: Record<string, AnyExtension>) {
    this._nativeExtensions = value;
  }

  getExtension<T extends AnyExtension | BaseExtension<any>>(extensionName: string): AnyExtension | BaseExtension<any> | null {
    if (extensionName in this._angularExtensions) {
      return this._angularExtensions[extensionName];
    }
    if (extensionName in this._nativeExtensions) {
      return this._nativeExtensions[extensionName];
    }
    return null;
  }
}
