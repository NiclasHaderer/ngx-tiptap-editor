import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { BaseControl, SelectBaseControl } from './base-control';

@Component({
  selector: 'tip-control-text-align',
  styleUrls: ['../../../../_controls.scss'],
  template: `
    <tip-select defaultValue="left" width="auto" [showIcon]="false"
                (change)="setAlign($event)" [disablePreviewSanitation]="disableSanitation">
      <tip-option value="left" [useHtml]="true" [enforceHeight]="true">
        <div class="content-wrapper" #left>
          <ng-content select="[data-left]"></ng-content>
        </div>
        <i *ngIf="left.childNodes.length === 0" class="material-icons">format_align_left</i>
      </tip-option>
      <tip-option value="right" [useHtml]="true" [enforceHeight]="true">
        <div class="content-wrapper" #right>
          <ng-content select="[data-right]"></ng-content>
        </div>
        <i *ngIf="right.childNodes.length === 0" class="material-icons">format_align_right</i>
      </tip-option>
      <tip-option value="center" [useHtml]="true" [enforceHeight]="true">
        <div class="content-wrapper" #center>
          <ng-content select="[data-center]"></ng-content>
        </div>
        <i *ngIf="center.childNodes.length === 0" class="material-icons">format_align_center</i>
      </tip-option>
      <tip-option value="justify" [useHtml]="true" [enforceHeight]="true">
        <div class="content-wrapper" #justify>
          <ng-content select="[data-justify]"></ng-content>
        </div>
        <i *ngIf="justify.childNodes.length === 0" class="material-icons">format_align_justify</i>
      </tip-option>
    </tip-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlTextAlignComponent)}],
})
export class ControlTextAlignComponent extends SelectBaseControl {
  @Input() public disableSanitation = false;

  protected canStyleParams = ['left', 'right', 'center', 'justify'];

  constructor(
    protected eventService: TiptapEventService
  ) {
    super();
  }

  public setAlign(alignment: 'justify' | 'left' | 'center' | 'right'): void {
    this.editor && this.editor.chain().focus().setTextAlign(alignment).run();
  }

  protected canStyle(alignment: 'justify' | 'left' | 'center' | 'right'): boolean {
    if (!this.editor) return false;
    return this.editor.can().setTextAlign(alignment);
  }

  protected currentActive(): 'left' | 'right' | 'center' | 'justify' | null {
    if (this.editor) {
      if (this.editor.isActive({textAlign: 'left'})) return 'left';
      if (this.editor.isActive({textAlign: 'right'})) return 'right';
      if (this.editor.isActive({textAlign: 'center'})) return 'center';
      if (this.editor.isActive({textAlign: 'justify'})) return 'justify';
    }
    return null;
  }
}
