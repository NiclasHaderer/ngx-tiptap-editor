import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, NgZone, Type } from '@angular/core';
import { BackgroundAnimation } from './dialog.animations';
import { DIALOG_DATA, DialogBaseClass, DialogData, DialogRef } from './dialog.helpers';


// @dynamic
@Component({
  selector: 'tip-dialog',
  template: `
    <div @openClose class="overlay" (click)="closeDialog()" [ngStyle]="{backgroundColor: dialogRef.dialogConfig.backdropColor}"></div>
    <div class="dialog-wrapper" [ngStyle]="position">
      <ng-container *ngIf="dialogRef.componentInstance" [ngComponentOutlet]="dialogRef.componentInstance"></ng-container>
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
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      padding: 10px;
      background-color: var(--tip-background-color);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent extends DialogBaseClass {
  public outletComponent: Type<any> | undefined;
  public position: Record<string, any> = {};

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    @Inject(DOCUMENT) protected document: Document,
    public dialogRef: DialogRef<any, any, any>,
    protected ngZone: NgZone
  ) {
    super();
    this.position = this.calculateStyle();
  }


  private calculateStyle(): Record<string, any> {
    const config = this.dialogRef.dialogConfig as DialogData<any>;

    return {
      width: config.width,
      maxWidth: config.maxWidth,
      top: config.position === 'top' ? '20%' : '50%',
    };
  }
}
