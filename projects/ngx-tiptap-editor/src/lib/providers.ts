import { InjectionToken } from '@angular/core';
import { Extensions } from '@tiptap/core';
import { ExtensionBuilder } from './extensions/base-extension.model';

export const GLOBAL_EXTENSIONS = new InjectionToken<Extensions>('GLOBAL_EXTENSIONS');
export const GLOBAL_ANGULAR_EXTENSIONS =
  new InjectionToken<ExtensionBuilder<any, any>[]>('GLOBAL_ANGULAR_EXTENSIONS');
