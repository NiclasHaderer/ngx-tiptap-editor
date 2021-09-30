import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostBinding,
  Inject,
  NgZone,
  OnInit,
  ViewChild
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { sleep } from '../../helpers';
import { PopOverPopUpAnimation } from './dialog.animations';
import { DialogBaseClass, DialogRef, PopoverData, TIP_DIALOG_DATA } from './dialog.helpers';

// @dynamic
@Component({
  selector: 'tip-popover',
  template: `
    <div class="popover-wrapper" [ngStyle]="style" #popover>
      <ng-container *ngIf="dialogRef.component" [ngComponentOutlet]="dialogRef.component"></ng-container>
      <div class="hide-arrow"></div>
      <div class="arrow"></div>
    </div>
  `,
  animations: [PopOverPopUpAnimation],
  styles: [`
    .popover-wrapper {
      border-radius: 5px;
      background-color: var(--tip-background-color);
      position: fixed;
      transform: translate(-50%, -100%);
      box-shadow: 0 1px 3px 1px rgba(60, 64, 67, .15);
      padding: 11px;
      z-index: 2000;
    }

    .hide-arrow {
      position: absolute;
      width: 30px;
      height: 10px;
      transform: translate(-50%, -100%);
      top: 100%;
      left: 50%;
      background-color: var(--tip-background-color);
      z-index: 1;
    }

    .arrow {
      position: absolute;
      top: 100%;
      left: 50%;
      width: 0;
      height: 0;
      box-shadow: 1px 1px 3px 1px rgba(60, 64, 67, .15);
      border: 7px solid var(--tip-background-color);
      transform: rotate(45deg) translate(-50%, -50%);
      transform-origin: 0 0;
      z-index: 0;
    }

  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent extends DialogBaseClass implements AfterViewInit, OnInit {
  public style: Record<string, string> = {};
  @ViewChild('popover') private popover!: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(TIP_DIALOG_DATA) private data: any,
    @Inject(DOCUMENT) protected document: Document,
    public dialogRef: DialogRef<any, any, any>,
    protected ngZone: NgZone,
    private cd: ChangeDetectorRef,
    private element: ElementRef
  ) {
    super();
    this.style = this.calculateStyle();
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.ngZone.runOutsideAngular(async () => {
      await sleep(1000);
      fromEvent<MouseEvent>(this.document, 'click')
        .pipe(
          takeUntil(this.destroy$),
          filter(e => !this.element.nativeElement.contains(e.target))
        )
        .subscribe(() => this.ngZone.run(() => this.dialogRef.cancel()));
    });
  }

  @HostBinding('@popUp')
  public ngAfterViewInit(): void {
    const position = this.popover.nativeElement.getBoundingClientRect();
    const window = this.document.defaultView;
    if (!window) return;

    const windowWidth = window.innerWidth;
    const overflowRight = (position.x + position.width) - windowWidth;

    const updateStyles: Record<string, string> = {};

    if (position.x < 0) {
      updateStyles.transform = `translate(calc(-50% + ${Math.abs(position.x - 5)}px), -100%)`;
    } else if (overflowRight > 0) {
      updateStyles.transform = `translate(calc(-50% - ${overflowRight + 5}px), -100%)`;
    }

    if (Object.keys(updateStyles).length > 0) {
      this.style = {
        ...this.style,
        ...updateStyles
      };

      this.cd.detectChanges();
    }
  }

  private calculateStyle(): Record<string, any> {
    const config = this.dialogRef.dialogConfig as PopoverData<any>;
    return {
      'top.px': config.position.y - 10,
      'left.px': config.position.x,
    };
  }
}
