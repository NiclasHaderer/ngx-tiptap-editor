import {ChangeDetectionStrategy, Component, ElementRef, forwardRef, OnDestroy, ViewChild} from '@angular/core';
import {TiptapEventService} from '../../services/tiptap-event.service';
import {BaseControl, ButtonBaseControl} from './base-control';
import '@tiptap/extension-color';

// TODO add option to remove color
// TODO put current color into the color picker
@Component({
  selector: 'tip-control-text-color',
  styleUrls: ['../../../../_controls.scss'],
  template: `
    <input #colorPicker type="color" style="display: none" (change)="changeColor($any($event.currentTarget).value)">
    <button class="tip-control-button" type="button" (click)="triggerColorPicker()" #button>
      <div class="content-wrapper" #ref>
        <ng-content></ng-content>
      </div>
      <i *ngIf="ref.childNodes.length === 0" class="material-icons">format_color_text</i>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => TextColorComponent)}],
})
export class TextColorComponent extends ButtonBaseControl implements OnDestroy {
  @ViewChild('colorPicker') private elementRef!: ElementRef<HTMLInputElement>;

  constructor(
    protected eventService: TiptapEventService,
  ) {
    super();
  }

  public triggerColorPicker(): void {
    this.elementRef.nativeElement.click();
  }

  public changeColor(color: string): void {
    this.editor && this.editor.chain().focus().setColor(color).run();
  }

  protected isActive(): boolean {
    return !!this.editor?.isActive('bold');
  }

  protected can(): boolean {
    return !!this.editor?.can().toggleBold();
  }
}
