import { ChangeDetectionStrategy, ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import type { Editor } from '@tiptap/core';
import { getHeadingsExtension } from '../../helpers';
import { HeadingLevel } from '../../models/types';
import { TiptapEventService } from '../../services/tiptap-event.service';
import { BaseControl, SelectBaseControl } from './base-control';

const isHeading = (level: number | string): level is HeadingLevel => typeof level === 'number';

@Component({
  selector: 'tip-format-control',
  styleUrls: ['../../../../_controls.scss'],
  template: `
    <tip-select (change)="selectTextLevel($event)" defaultValue="paragraph"
                [disablePreviewSanitation]="disableSanitation">
      <tip-option *ngFor="let level of levels" [value]="level">
        <div [innerHTML]="headingHtml[level]"></div>
      </tip-option>
      <tip-option value="paragraph">
        <div>
          <p class="no-margin light-font">Paragraph</p>
        </div>
      </tip-option>
    </tip-select>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlFormatComponent)}],
})
export class ControlFormatComponent extends SelectBaseControl {
  @Input() public disableSanitation = false;
  public levels: HeadingLevel[] = [];
  public headingHtml: Record<number, string> = {};
  protected canStyleParams: (number | string)[] = [];

  constructor(
    protected eventService: TiptapEventService,
    private cd: ChangeDetectorRef
  ) {
    super();
  }

  public setEditor(editor: Editor): void {
    super.setEditor(editor);
    this.levels = getHeadingsExtension(editor).options.levels;
    this.canStyleParams = [...this.levels, 'paragraph'];
    this.headingHtml = [...this.levels].reduce((previousValue, currentValue) => {
      previousValue[currentValue] = `<h${currentValue} class="no-margin light-font">Heading ${currentValue}</h${currentValue}>`;
      return previousValue;
    }, {} as Record<string, string>);
    this.cd.detectChanges();
  }

  public selectTextLevel(format: number | string): void {
    if (isHeading(format)) {
      this.setHeading(format);
    } else {
      this.setParagraph();
    }
  }

  protected canStyle(format: number | string): boolean {
    if (!this.editor) return false;
    if (isHeading(format)) {
      return this.editor.can().chain().setHeading({level: format}).run();
    } else {
      return this.editor.can().chain().setParagraph().run();
    }
  }

  protected currentActive(): string | number | null {
    if (this.editor) {
      const headingAttributes = this.editor.getAttributes('heading');
      if (headingAttributes.level) return headingAttributes.level;
      if (this.editor.isActive('paragraph')) return 'paragraph';
    }
    return null;
  }

  private setParagraph(): void {
    this.editor && this.editor.chain().setParagraph().run();
  }

  private setHeading(headingLevel: HeadingLevel): void {
    this.editor && this.editor.chain().focus().setHeading({level: headingLevel}).focus().run();
  }
}
