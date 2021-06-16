import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import type { Editor } from '@tiptap/core';

@Component({
  selector: 'tip-editor-body, tip-editor-body[minHeight][maxHeight]',
  template: `
    <div class="editor-body" #editorBody [ngStyle]="{minHeight: minHeight, maxHeight: maxHeight, height: height}"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-body.component.scss']
})
export class EditorBodyComponent {
  @Input() public minHeight = '';
  @Input() public maxHeight = '';
  private editor: Editor | null = null;

  @ViewChild('editorBody', {static: true}) private _editorElement: ElementRef<HTMLDivElement> | null = null;

  get editorElement(): HTMLDivElement | null {
    return this._editorElement ? this._editorElement.nativeElement : null;
  }

  public setEditor(tiptapEditor: Editor): void {
    this.editor = tiptapEditor;
  }

  public get height(): string {
    if (this.minHeight && !this.maxHeight || this.maxHeight && !this.minHeight) {
      console.warn('You have to set minHeight and maxHeight of the tip-editor-body for it to work properly.\n' +
        'The values however can be the same');
      return '';
    }

    return '200vh';
  }

}
