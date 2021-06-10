import { DOCUMENT } from '@angular/common';
import { Component, ComponentRef, Inject, InjectionToken, OnDestroy, OnInit, Type } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { DialogService } from '../../services/dialog.service';
import { BackgroundAnimation } from './dialog.animations';

export const DIALOG_DATA = new InjectionToken<DialogData<any>>('DIALOG_DATA');

export interface DialogData<D> {
  data?: D;
  autoClose?: boolean;
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
  }
}

// @dynamic
@Component({
  selector: 'tip-dialog',
  template: `
    <div @openClose class="overlay" (click)="closeDialog()"></div>
    <ng-container *ngIf="outletComponent" [ngComponentOutlet]="outletComponent"></ng-container>
  `,
  animations: [BackgroundAnimation],
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      background-color: var(--tip-overlay-color);
    }`]
})
export class DialogComponent implements OnInit, OnDestroy {

  public outletComponent: Type<any> | undefined;
  private destroy$ = new Subject<boolean>();

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    private dialogRef: DialogRef<any, any, any>,
    @Inject(DOCUMENT) private document: Document
  ) {
    console.log(data);
  }


  public ngOnInit(): void {
    fromEvent<KeyboardEvent>(this.document, 'keydown').pipe(
      filter(e => e.key === 'Escape'),
      takeUntil(this.destroy$)
    ).subscribe(() => this.closeDialog());
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }


  public closeDialog(): void {
    this.dialogRef.setStatus('canceled');
    this.dialogRef.closeDialog(null);
  }
}
