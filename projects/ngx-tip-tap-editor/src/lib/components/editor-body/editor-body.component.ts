import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import type { Editor } from '@tiptap/core';

@Component({
  selector: 'tip-editor-body',
  template: `
    <div class="editor-body" #editorBody></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./editor-body.component.scss']
})
export class EditorBodyComponent {
  private editor: Editor | null = null;

  @ViewChild('editorBody', {static: true}) private _editorElement: ElementRef<HTMLDivElement> | null = null;

  get editorElement(): HTMLDivElement | null {
    return this._editorElement ? this._editorElement.nativeElement : null;
  }

  public setEditor(tiptapEditor: Editor): void {
    this.editor = tiptapEditor;
  }

}
