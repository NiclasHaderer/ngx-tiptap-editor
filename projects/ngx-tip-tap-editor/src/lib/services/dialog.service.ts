import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentFactoryResolver,
  ComponentRef,
  EmbeddedViewRef,
  Inject,
  Injectable,
  Injector,
  Type
} from '@angular/core';
import { DIALOG_DATA, DialogComponent, DialogData, DialogRef } from '../components/dialog/dialog.component';
import { LinkControlComponent } from '../components/editor-header/controls/link-control.component';

// @dynamic
@Injectable({providedIn: 'root'})
export class DialogService {

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private injector: Injector,
    @Inject(DOCUMENT) private document: Document
  ) {
    setTimeout(() => {
      const ref = this.openDialog(LinkControlComponent);
    });
  }

  public openDialog<R, D, C>(component: Type<C>, config: DialogData<D> = {}): DialogRef<R, D, Type<C>> {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(DialogComponent);
    const dialogReferenceList: ComponentRef<DialogComponent>[] = [];
    const dialogRef = new DialogRef<R, D, Type<C>>(component, this, dialogReferenceList, config);
    const componentInjector = Injector.create({
      providers: [
        {provide: DIALOG_DATA, useValue: config.data},
        {provide: DialogRef, useValue: dialogRef}
      ],
      parent: this.injector
    });
    const componentRef = componentFactory.create(componentInjector);
    dialogReferenceList.push(componentRef);
    this.appRef.attachView(componentRef.hostView);
    componentRef.instance.outletComponent = component;

    const domElement = (componentRef.hostView as EmbeddedViewRef<any>).rootNodes[0] as HTMLElement;
    this.document.body.appendChild(domElement);

    return dialogRef;
  }

  public removeOverlay(componentRef: ComponentRef<any>): void {
    this.appRef.detachView(componentRef.hostView);
    componentRef.destroy();
  }
}
