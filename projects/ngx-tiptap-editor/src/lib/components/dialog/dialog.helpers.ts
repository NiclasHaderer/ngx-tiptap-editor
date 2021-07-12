import { ComponentRef, Directive, InjectionToken, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DialogService } from '../../services/dialog.service';

export const DIALOG_DATA = new InjectionToken<DialogData<any>>('DIALOG_DATA');

export interface OverlayData<D> {
  data?: D;
  autoClose: boolean;
  maxWidth: string;
  width: string;
  backdropColor: string;
}

export interface DialogData<D> extends OverlayData<D> {
  type: 'dialog';
  position: 'top' | 'center';
}

export interface PopoverData<D> extends OverlayData<D> {
  type: 'popover';
  position: {
    x: number,
    y: number,
  };
}

export interface ResultData<D> {
  data: ResultData<D>['status'] extends 'canceled' ? null : D;
  status: 'success' | 'canceled';
}

export class DialogRef<RESULT, CONFIG_DATA, COMPONENT> {
  /* tslint:disable */
  private subject$ = new Subject<ResultData<RESULT | null>>();
  public result$ = this.subject$.asObservable();

  /* tslint:enable */

  constructor(
    private _componentInstance: COMPONENT,
    private dialogService: DialogService,
    private dialogComponentRef: { component?: ComponentRef<DialogBaseClass> },
    private config: DialogData<CONFIG_DATA> | PopoverData<CONFIG_DATA>
  ) {
  }

  public get componentInstance(): COMPONENT {
    return this._componentInstance;
  }

  public get dialogConfig(): Omit<DialogData<CONFIG_DATA>, 'data'> | Omit<PopoverData<CONFIG_DATA>, 'data'> {
    const copy = {...this.config};
    delete copy.data;
    return copy;
  }

  private get dialogComponent(): ComponentRef<DialogBaseClass> {
    return this.dialogComponentRef.component!;
  }

  public submitDialog(data: RESULT): void {
    this.sendResult(data, 'success');
  }

  public cancelDialog(): void {
    this.sendResult(null, 'canceled');
  }

  private sendResult(data: RESULT | null, status: ResultData<RESULT>['status']): void {
    this.dialogService.removeOverlay(this.dialogComponent);
    this.subject$.next({data, status});
    this.subject$.complete();
  }
}

@Directive()
// tslint:disable-next-line:directive-class-suffix
export abstract class DialogBaseClass implements OnInit, OnDestroy {
  protected abstract ngZone: NgZone;
  protected abstract document: Document;
  protected abstract dialogRef: DialogRef<any, any, any>;

  private destroy$ = new Subject<boolean>();

  public ngOnInit(): void {
    this.ngZone.runOutsideAngular(() => {
      fromEvent<KeyboardEvent>(this.document, 'keydown').pipe(
        filter(e => e.key === 'Escape'),
        takeUntil(this.destroy$)
      ).subscribe(() => this.ngZone.run(() => this.closeDialog()));
    });
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  public closeDialog(): void {
    if (!this.dialogRef.dialogConfig.autoClose) return;
    this.dialogRef.cancelDialog();
  }

}
