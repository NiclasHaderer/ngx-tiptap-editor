import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, Inject, NgZone } from '@angular/core';
import { FadeInAnimation } from '../../animations';
import { OverlayPopUpAnimation } from './dialog.animations';
import { TIP_DIALOG_DATA, DialogBaseClass, DialogData, DialogRef } from './dialog.helpers';


// @dynamic
@Component({
  selector: 'tip-dialog',
  template: `
    <div class="overlay" (click)="closeDialog()" [ngStyle]="{backgroundColor: dialogRef.dialogConfig.backdropColor}"></div>
    <div class="dialog-wrapper" [ngStyle]="position">
      <ng-container *ngIf="dialogRef.component" [ngComponentOutlet]="dialogRef.component"></ng-container>
    </div>
  `,
  animations: [FadeInAnimation, OverlayPopUpAnimation],
  styles: [`
    .overlay {
      position: fixed;
      top: 0;
      bottom: 0;
      right: 0;
      left: 0;
      z-index: 2000;
    }

    .dialog-wrapper {
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);
      border-radius: 5px;
      padding: 10px;
      z-index: 2000;
      background-color: var(--tip-background-color);
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DialogComponent extends DialogBaseClass {
  public position: Record<string, any> = {};

  constructor(
    @Inject(TIP_DIALOG_DATA) private data: any,
    @Inject(DOCUMENT) protected document: Document,
    public dialogRef: DialogRef<any, any, any>,
    protected ngZone: NgZone
  ) {
    super();
    this.position = this.calculateStyle();
  }

  @HostBinding('@fadeIn')
  @HostBinding('@popUp')
  private calculateStyle(): Record<string, any> {
    const config = this.dialogRef.dialogConfig as DialogData<any>;

    return {
      width: config.width,
      maxWidth: config.maxWidth,
      top: config.position === 'top' ? '20%' : '50%',
    };
  }
}
