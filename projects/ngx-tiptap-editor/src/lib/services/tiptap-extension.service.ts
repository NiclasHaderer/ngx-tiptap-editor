import { Injectable } from '@angular/core';
import { AnyExtension } from '@tiptap/core';
import { TipBaseExtension } from '../extensions/tip-base-extension';

@Injectable({
  providedIn: 'root'
})
export class TiptapExtensionService {
  private _nativeExtensions: Record<string, AnyExtension> = {};
  private _angularExtensions: Record<string, TipBaseExtension<any>> = {};

  public get angularExtensions(): Record<string, TipBaseExtension<any>> {
    return this._angularExtensions;
  }

  public setAngularExtensions(value: TipBaseExtension<any>[]): void {
    this._angularExtensions = value.reduce((previousValue, currentValue) => {
      previousValue[currentValue.nativeExtension.name] = currentValue;
      return previousValue;
    }, {} as Record<string, TipBaseExtension<any>>);
  }

  public get nativeExtensions(): Record<string, AnyExtension> {
    return this._nativeExtensions;
  }

  public setNativeExtensions(value: AnyExtension[]): void {
    this._nativeExtensions = value.reduce((previousValue, currentValue) => {
      previousValue[currentValue.name] = currentValue;
      return previousValue;
    }, {} as Record<string, AnyExtension>);
  }

  getExtension<T extends AnyExtension | TipBaseExtension<any>>(extensionName: string): AnyExtension | TipBaseExtension<any> | null {
    if (extensionName in this._angularExtensions) {
      return this._angularExtensions[extensionName];
    }
    if (extensionName in this._nativeExtensions) {
      return this._nativeExtensions[extensionName];
    }
    return null;
  }
}
