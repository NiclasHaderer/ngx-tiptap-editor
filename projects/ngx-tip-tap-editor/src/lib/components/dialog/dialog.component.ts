import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgZone, OnDestroy, OnInit, Type } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BackgroundAnimation } from './dialog.animations';
import { DIALOG_DATA, DialogData, DialogRef } from './dialog.helpers';


// @dynamic
@Component({
  selector: 'tip-dialog',
  template: `
    <div @openClose class="overlay" (click)="closeDialog()" [ngStyle]="{backgroundColor: config.backdropColor}"></div>
    <div class="dialog-wrapper"
         [ngStyle]="{
         width: config.width,
         maxWidth: config.maxWidth,
         top: config.position === 'top' ? '20%': '50%'
         }">
      <ng-container *ngIf="outletComponent" [ngComponentOutlet]="outletComponent"></ng-container>
    </div>
  `,
  animations: [BackgroundAnimation],
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
    }

    .dialog-wrapper {
      border-radius: 5px;
      padding: 10px;
      position: absolute;
      top: 50%;
      left: 50%;
      background-color: var(--tip-background-color);
      transform: translate(-50%, -50%);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit, OnDestroy {

  public outletComponent: Type<any> | undefined;
  public config: Omit<DialogData<any>, 'data'>;
  private destroy$ = new Subject<boolean>();

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    private dialogRef: DialogRef<any, any, any>,
    @Inject(DOCUMENT) private document: Document,
    private ngZone: NgZone
  ) {
    this.config = dialogRef.dialogConfig;
  }


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

    this.dialogRef.setStatus('canceled');
    this.dialogRef.closeDialog(null);
  }
}
