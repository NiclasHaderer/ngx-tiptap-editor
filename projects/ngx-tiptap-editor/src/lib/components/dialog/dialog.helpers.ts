import { ApplicationRef, ComponentRef, Directive, InjectionToken, NgZone, OnDestroy, OnInit } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

export const TIP_DIALOG_DATA = new InjectionToken<DialogData<any>>('DIALOG_DATA');

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
  /* tslint:disable member-ordering*/
  private subject$ = new Subject<ResultData<RESULT | null>>();
  public result$ = this.subject$.asObservable();

  /* tslint:enable */

  constructor(
    private _component: COMPONENT,
    private appRef: ApplicationRef,
    private dialogWrapperComponentRef: { component?: ComponentRef<DialogBaseClass> },
    private config: DialogData<CONFIG_DATA> | PopoverData<CONFIG_DATA>
  ) {
  }

  public get component(): COMPONENT {
    return this._component;
  }

  public get dialogConfig(): Omit<DialogData<CONFIG_DATA>, 'data'> | Omit<PopoverData<CONFIG_DATA>, 'data'> {
    const copy = {...this.config};
    delete copy.data;
    return copy;
  }

  private get dialogWrapperComponent(): ComponentRef<DialogBaseClass> {
    return this.dialogWrapperComponentRef.component!;
  }

  public submit(data: RESULT): void {
    this.sendResult(data, 'success');
  }

  public cancel(): void {
    this.sendResult(null, 'canceled');
  }

  private sendResult(data: RESULT | null, status: ResultData<RESULT>['status']): void {
    this.appRef.detachView(this.dialogWrapperComponent.hostView);
    this.dialogWrapperComponent.destroy();
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
  protected destroy$ = new Subject<boolean>();

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
    this.dialogRef.cancel();
  }

}
