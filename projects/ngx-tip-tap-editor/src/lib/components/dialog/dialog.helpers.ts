import { ComponentRef, InjectionToken } from '@angular/core';
import { Subject } from 'rxjs';
import { DialogService } from '../../services/dialog.service';
import { DialogComponent } from './dialog.component';

export const DIALOG_DATA = new InjectionToken<DialogData<any>>('DIALOG_DATA');

export interface DialogData<D> {
  data?: D;
  autoClose?: boolean;
  maxWidth?: string;
  width?: string;
  backdropColor?: string;
  position?: 'top' | 'center';
}

export interface ResultData<D> {
  data: ResultData<D>['status'] extends 'canceled' ? null : D;
  status: 'success' | 'canceled';
}

export class DialogRef<RESULT, CONFIG_DATA, COMPONENT> {

  private subject$ = new Subject<ResultData<RESULT>>();
  public result$ = this.subject$.asObservable();
  private status: ResultData<RESULT>['status'] = 'success';

  constructor(
    private _componentInstance: COMPONENT,
    private dialogService: DialogService,
    private dialogComponentList: ComponentRef<DialogComponent>[],
    private config: DialogData<CONFIG_DATA>
  ) {
  }

  public get componentInstance(): COMPONENT {
    return this._componentInstance;
  }

  public get dialogConfig(): Omit<DialogData<any>, 'data'> {
    const copy = {...this.config};
    delete copy.data;
    return copy;
  }

  private get dialogComponent(): ComponentRef<DialogComponent> {
    return this.dialogComponentList[0];
  }

  public setStatus(status: ResultData<RESULT>['status']): void {
    this.status = status;
  }

  public closeDialog(data: RESULT): void {
    this.dialogService.removeOverlay(this.dialogComponent);
    this.subject$.next({
      data,
      status: this.status
    });
    this.subject$.complete();
  }
}
