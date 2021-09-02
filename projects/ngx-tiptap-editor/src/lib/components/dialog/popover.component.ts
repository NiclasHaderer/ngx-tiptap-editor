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
import { takeUntil } from 'rxjs/operators';
import { sleep } from '../../helpers';
import { PopOverPopUpAnimation } from './dialog.animations';
import { DialogBaseClass, DialogRef, PopoverData, TIP_DIALOG_DATA } from './dialog.helpers';

// @dynamic
@Component({
  selector: 'tip-popover',
  template: `
    <div class="popover-wrapper" [ngStyle]="style" #popover>
      <ng-container *ngIf="dialogRef.component" [ngComponentOutlet]="dialogRef.component"></ng-container>
    </div>
  `,
  animations: [PopOverPopUpAnimation],
  styles: [`
    .popover-wrapper {
      border-radius: 5px;
      background-color: var(--tip-background-color);
      position: fixed;
      transform: translate(-50%, -100%);
      border: solid 1px var(--tip-border-color);
      padding: 5px;
      z-index: 2000;
    }`],
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
        .pipe(takeUntil(this.destroy$))
        .subscribe(e => {
          if (this.element.nativeElement.contains(e.target)) return;
          this.ngZone.run(() => this.dialogRef.cancel());
        });
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
      updateStyles.transform = `translate(calc(-50% + ${Math.abs(position.x)}px), -100%)`;
    } else if (overflowRight > 0) {
      updateStyles.transform = `translate(calc(-50% - ${overflowRight}px), -100%)`;
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
      'top.px': config.position.y,
      'left.px': config.position.x,
    };
  }
}
