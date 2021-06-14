import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgZone, OnDestroy, OnInit, Type } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { BackgroundAnimation } from './dialog.animations';
import { DIALOG_DATA, DialogData, DialogRef, PopoverData } from './dialog.helpers';


const isPopover =
  (data: Omit<DialogData<any>, 'data'> | Omit<PopoverData<any>, 'data'>): data is Omit<PopoverData<any>, 'data'> => data.type === 'popover';


// @dynamic
@Component({
  selector: 'tip-dialog',
  template: `
    <div *ngIf="config.type === 'dialog'" @openClose class="overlay" (click)="closeDialog()" [ngStyle]="{backgroundColor: config.backdropColor}"></div>
    <div class="dialog-wrapper"
         [ngStyle]="position">
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
      background-color: var(--tip-background-color);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent implements OnInit, OnDestroy {

  public outletComponent: Type<any> | undefined;
  public config: Omit<DialogData<any>, 'data'> | Omit<PopoverData<any>, 'data'>;
  public position: Record<string, any> = {};
  private destroy$ = new Subject<boolean>();

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    @Inject(DOCUMENT) private document: Document,
    private dialogRef: DialogRef<any, any, any>,
    private ngZone: NgZone
  ) {
    this.config = dialogRef.dialogConfig;
    this.outletComponent = this.dialogRef.componentInstance;
    this.position = this.calculateStyle();
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

  private calculateStyle(): Record<string, any> {
    if (isPopover(this.config)) {
      return {
        'top.px': this.config.position.y,
        'left.px': this.config.position.x,
        position: 'fixed',
        transform: 'translate(-50%, -100%)',
        border: 'solid 1px var(--tip-border-color)',
        padding: '5px'
      };
    }

    return {
      width: this.config.width,
      maxWidth: this.config.maxWidth,
      top: this.config.position === 'top' ? '20%' : '50%',
      left: '50%',
      position: 'absolute',
      transform: 'translate(-50%, -50%)'
    };
  }
}
