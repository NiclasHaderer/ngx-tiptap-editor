import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import type { Editor } from '@tiptap/core';

@Component({
  selector: 'tip-editor-body, tip-editor-body[minHeight][maxHeight]',
  template: `
    <div class="editor-body" [ngStyle]="{minHeight: minHeight, maxHeight: maxHeight}"
         #bodyWrapper
    >
      <div class="tiptap-view" #editorBody></div>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-body.component.scss']
})
export class EditorBodyComponent {
  @Input() public minHeight = '';
  @Input() public maxHeight = '';
  private _displayTopCurves = true;
  private _displayBottomCurves = true;
  private editor: Editor | null = null;
  @ViewChild('editorBody') private _editorElement: ElementRef<HTMLDivElement> | null = null;
  @ViewChild('bodyWrapper') private _bodyWrapper: ElementRef<HTMLDivElement> | null = null;

  public set displayTopCurves(value: boolean) {
    this._displayTopCurves = value;
    this.applyBorderClasses();
  }

  public set displayBottomCurves(value: boolean) {
    this._displayBottomCurves = value;
    this.applyBorderClasses();

  }

  get editorElement(): HTMLDivElement | null {
    return this._editorElement ? this._editorElement.nativeElement : null;
  }

  public get height(): string {
    if (this.minHeight && !this.maxHeight) {

      return this.minHeight;
    }

    if (this.minHeight && !this.maxHeight || this.maxHeight && !this.minHeight) {
      console.warn('You have to set minHeight and maxHeight of the tip-editor-body for it to work properly.\n' +
        'The values however can be the same');
      return '';
    } else if (!this.minHeight && !this.maxHeight) {
      return '';
    }

    return '200vh';
  }

  public setEditor(tiptapEditor: Editor): void {
    this.editor = tiptapEditor;
  }

  private applyBorderClasses(): void {
    if (!this._bodyWrapper) return;
    const wrapperElement = this._bodyWrapper.nativeElement;
    if (this._displayBottomCurves) {
      wrapperElement.classList.add('curve-bottom');
    } else {
      wrapperElement.classList.remove('curve-bottom');
    }
    if (this._displayTopCurves) {
      wrapperElement.classList.add('curve-top');
    } else {
      wrapperElement.classList.remove('curve-top');
    }
  }

}
