import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, EmbeddedViewRef, Inject, Injectable, Injector, Type } from '@angular/core';
import { DialogComponent } from '../components/dialog/dialog.component';
import { DialogBaseClass, DialogData, DialogRef, PopoverData, TIP_DIALOG_DATA } from '../components/dialog/dialog.helpers';
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

  public openDialog<RETURN, DATA = any, COMPONENT = any>(
    component: Type<COMPONENT>,
    config: Partial<DialogData<DATA>> = {}
  ): DialogRef<RETURN, DATA, Type<COMPONENT>> {
    // Fill with default values
    const newConfig: DialogData<DATA> = {
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

  public openPopover<RETURN, DATA = any, COMPONENT extends Type<any> = any>(
    component: COMPONENT,
    config: Partial<PopoverData<DATA>> & { position: PopoverData<any>['position'] }
  ): DialogRef<RETURN, DATA, COMPONENT> {

    const newConfig: PopoverData<DATA> = {
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

  /**
   * @param component The component which will be displayed
   * @param config The config of the dialog
   * @param wrapperComponent The wrapper component which will encapsulate the user component
   */
  private createAndAttachComponent(
    component: Type<any>,
    config: DialogData<any> | PopoverData<any>,
    wrapperComponent: Type<PopoverComponent | DialogComponent>
  ): DialogRef<any, any, any> {


    const dialogReference: { component?: ComponentRef<DialogBaseClass> } = {};
    const dialogRef = new DialogRef<any, any, any>(component, this.appRef, dialogReference, config);
    const componentInjector = Injector.create({
      providers: [
        {provide: TIP_DIALOG_DATA, useValue: config.data},
        {provide: DialogRef, useValue: dialogRef}
      ],
      parent: this.injector
    });

    // Create the component wrapper which in turn will attach the user component to the view
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(wrapperComponent);
    const componentRef = componentFactory.create(componentInjector);
    dialogReference.component = componentRef;
    this.appRef.attachView(componentRef.hostView);

    // Attach the component wrapper
    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.document.body.appendChild(domElement);

    return dialogRef;
  }

}
