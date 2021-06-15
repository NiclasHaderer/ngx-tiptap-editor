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
  ViewChild
} from '@angular/core';
import { PopOverPopUpAnimation } from './dialog.animations';
import { DIALOG_DATA, DialogBaseClass, DialogRef, PopoverData } from './dialog.helpers';

@Component({
  selector: 'tip-popover',
  template: `
    <div class="popover-wrapper" [ngStyle]="style" #popover>
      <ng-container *ngIf="dialogRef.componentInstance" [ngComponentOutlet]="dialogRef.componentInstance"></ng-container>
    </div>`,
  animations: [PopOverPopUpAnimation],
  styles: [`
    .popover-wrapper {
      border-radius: 5px;
      background-color: var(--tip-background-color);
      position: fixed;
      transform: translate(-50%, -100%);
      border: solid 1px var(--tip-border-color);
      padding: 5px;
    }`],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PopoverComponent extends DialogBaseClass implements AfterViewInit {
  public style: Record<string, string> = {};
  @ViewChild('popover') private popover!: ElementRef<HTMLDivElement>;

  constructor(
    @Inject(DIALOG_DATA) private data: any,
    @Inject(DOCUMENT) protected document: Document,
    public dialogRef: DialogRef<any, any, any>,
    protected ngZone: NgZone,
    private cd: ChangeDetectorRef
  ) {
    super();
    this.style = this.calculateStyle();
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
