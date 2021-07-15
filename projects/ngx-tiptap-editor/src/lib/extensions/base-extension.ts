import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Injector,
  NgZone,
  StaticProvider,
  Type
} from '@angular/core';
import { AnyExtension, Editor } from '@tiptap/core';
import { Subject } from 'rxjs';
import { C, ObjectProp } from '../models/utility-types';
import { Constructor, ExtensionBuilder } from './base-extension.model';

export interface BaseExtension<T> {
  defaultOptions: Partial<T>;

  onEditorReady(): any;

  onEditorDestroy(): any;
}

export abstract class BaseExtension<T extends object> {
  protected destroy$ = new Subject<boolean>();
  private _nativeExtension!: AnyExtension;
  private _options!: T;
  private _editor!: Editor;


  public static create<EXTENSION extends Constructor, OPTIONS extends ObjectProp<C.Instance<EXTENSION>, 'options'>>(
    extension: EXTENSION,
    extensionOptions: OPTIONS,
  ): ExtensionBuilder<OPTIONS, C.Instance<EXTENSION>> {
    return {
      options: extensionOptions,
      angularExtension: extension,
      build(parentInjector: Injector): C.Instance<EXTENSION> {

        const injector2 = Injector.create({
          providers: [{provide: this.angularExtension}],
          parent: parentInjector
        });

        const injectedExtension = injector2.get(this.angularExtension);
        injectedExtension.options = this.options;
        injectedExtension.nativeExtension = injectedExtension.createExtension(injectedExtension.options);
        return injectedExtension;
      }
    };
  }

  public onEditorDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public abstract createExtension(extensionOptions: Required<T>): AnyExtension;

  public set options(value: T) {
    if (this._options) {
      console.warn(`${this.constructor.name} already has the options set. Don't try to set it twice.`);
      return;
    }

    if (this.defaultOptions) {
      this._options = {
        ...this.defaultOptions,
        ...value
      };
    } else {
      this._options = value;
    }
  }

  public get options(): T {
    return this._options;
  }

  public set editor(value: Editor) {
    if (this._editor) {
      console.warn(`${this.constructor.name} already has the editor set. Don't try to set it twice.`);
      return;
    }
    this._editor = value;
  }

  public get editor(): Editor {
    return this._editor;
  }

  public set nativeExtension(value: AnyExtension) {
    if (this._nativeExtension) {
      console.warn(`${this.constructor.name} already has a nativeExtension assigned to it.`,
        `Don't try to assign it twice`);
      return;
    }
    this._nativeExtension = value;
  }

  public get nativeExtension(): AnyExtension {
    return this._nativeExtension;
  }

  public editorDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}

export abstract class AdvancedBaseExtension<T extends object> extends BaseExtension<T> {
  protected abstract injector: Injector;

  /**
   * Inject the provided component at any position in the dom
   * @param component The component which should be injected
   * @param injectionPoint The point you want to inject the component into (this.document.body for example)
   */
  protected createAndInsertIntoDom<COMP>(component: Type<COMP>, injectionPoint: HTMLElement): { remove: () => void } {
    const componentRef = this.createComponent(component);
    return this.insertComponent(componentRef, injectionPoint);
  }

  protected insertComponent(componentRef: ComponentRef<any>, injectionPoint: HTMLElement): { remove: () => void } {
    const appRef = this.injector.get(ApplicationRef);
    appRef.attachView(componentRef.hostView);
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    injectionPoint.appendChild(domElement);

    const ngZone = this.injector.get(NgZone);
    return {
      remove: () => {
        ngZone.run(() => {
          appRef.detachView(componentRef.hostView);
          componentRef.destroy();
        });
      }
    };
  }

  protected createComponent<COMP>(component: Type<COMP>, additionalProviders: StaticProvider[] = []): ComponentRef<COMP> {
    const componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
    const componentFactory = componentFactoryResolver.resolveComponentFactory(component);

    const injector = Injector.create({
      providers: additionalProviders,
      parent: this.injector
    });

    return componentFactory.create(injector);
  }
}
