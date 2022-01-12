import { ChangeDetectionStrategy, Component, ContentChildren, QueryList } from '@angular/core';
import { Editor } from '@tiptap/core';
import { BaseControl } from '../controls/base-control';

@Component({
  selector: 'tip-editor-footer',
  template: `
    <div class="controls-row">
      <ng-content></ng-content>
    </div>
  `,
  styleUrls: ['./editor-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditorFooterComponent {
  public editor: Editor | null = null;

  @ContentChildren(BaseControl) children: QueryList<BaseControl> | null = null;

  public setEditor(tiptapEditor: Editor): void {
    this.editor = tiptapEditor;
    this.passEditorToControls();
  }

  public passEditorToControls(): void {
    this.children && this.children.forEach(control => this.editor && control.setEditor(this.editor));
  }

}
