import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Inject, Injectable, Injector, Type } from '@angular/core';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DIALOG_DATA, DialogBaseClass, DialogData, DialogRef, PopoverData } from '../components/dialog/dialog.helpers';
import { PopoverComponent } from '../components/dialog/popover.component';

// @dynamic
@Injectable({providedIn: 'root'})
export class TipDialogService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
  }

  public openDialog<R, D = any, C = any>(component: Type<C>, config: Partial<DialogData<D>> = {}): DialogRef<R, D, Type<C>> {
    // Fill with default values
    const newConfig: DialogData<D> = {
      ...{
        type: 'dialog',
        autoClose: true,
        maxWidth: '1000px',
        width: '50%',
        backdropColor: 'var(--tip-overlay-color)',
        position: 'center'
      }, ...config
    };

    return this.createAndAttachComponent(component, newConfig, DialogComponent);
  }

  public openPopover<R, C extends Type<any>, D>(
    component: C,
    config: Partial<PopoverData<D>> & { position: PopoverData<any>['position'] }
  ): DialogRef<R, D, C> {

    const newConfig: PopoverData<D> = {
      ...{
        type: 'popover',
        autoClose: true,
        maxWidth: 'auto',
        width: 'auto',
        backdropColor: 'transparent',
      },
      ...config
    };

    return this.createAndAttachComponent(component, newConfig, PopoverComponent);
  }

  public removeOverlay(componentRef: ComponentRef<any>): void {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }

  private createAndAttachComponent(
    component: Type<any>,
    config: DialogData<any> | PopoverData<any>,
    wrapperComponent: Type<PopoverComponent | DialogComponent>
  ): DialogRef<any, any, any> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(wrapperComponent);
    const dialogReference: { component?: ComponentRef<DialogBaseClass> } = {};
    const dialogRef = new DialogRef<any, any, any>(component, this, dialogReference, config);
    const componentInjector = Injector.create({
      providers: [
        {provide: DIALOG_DATA, useValue: config.data},
        {provide: DialogRef, useValue: dialogRef}
      ],
      parent: this.injector
    });
    const componentRef = componentFactory.create(componentInjector);
    dialogReference.component = componentRef;
    this.appRef.attachView(componentRef.hostView);

    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.document.body.appendChild(domElement);

    return dialogRef;
  }

}
