import { ApplicationRef, ComponentFactoryResolver, EmbeddedViewRef, Injector, Type } from '@angular/core';
import { AnyExtension, Editor } from '@tiptap/core';
import { Subject } from 'rxjs';
import { Constructor, ExtensionBuilder } from './base-extension.model';
import { C } from './ts-toolbelt';

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


  public static create<EXTENSION extends Constructor, OPTIONS = Parameters<C.Instance<EXTENSION>['createExtension']>[0]>(
    extension: EXTENSION,
    extensionOptions: OPTIONS
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
        injectedExtension.nativeExtension = injectedExtension.createExtension(this.options);
        return injectedExtension;
      }
    };
  }

  public onEditorDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public abstract createExtension(extensionOptions: T): AnyExtension;

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

export abstract class ExtendedBaseExtension<T extends object> extends BaseExtension<T> {
  protected abstract componentFactoryResolver: ComponentFactoryResolver;
  protected abstract document: Document;
  protected abstract injector: Injector;
  protected abstract appRef: ApplicationRef;

  protected insertComponentInDom(component: Type<any>): { remove: () => void } {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component);
    const componentRef = componentFactory.create(this.injector);
    this.appRef.attachView(componentRef.hostView);
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.document.body.appendChild(domElement);

    return {
      remove: () => {
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      }
    };
  }
}
