import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditorBodyComponent } from './components/editor-body/editor-body.component';
import { BoldControlComponent } from './components/editor-header/controls/bold-control.component';
import { BulletListControlComponent } from './components/editor-header/controls/bullet-list-control.component';
import { HeadingControlComponent } from './components/editor-header/controls/heading.component';
import { ItalicControlComponent } from './components/editor-header/controls/italic-control.component';
import { NumberListControlComponent } from './components/editor-header/controls/number-list-control.component';
import { TextAlignControlComponent } from './components/editor-header/controls/text-align.component';
import { UnderlineControlComponent } from './components/editor-header/controls/underline-control.component';
import { EditorHeaderComponent } from './components/editor-header/editor-header.component';
import { ControlBreakLineComponent } from './components/editor-header/utils/control-break-line.component';
import { ControlHorizontalDividerComponent } from './components/editor-header/utils/control-horizontal-divider.component';
import { ControlSpacerComponent } from './components/editor-header/utils/control-spacer.component';
import { ControlVerticalDividerComponent } from './components/editor-header/utils/control-vertical-divider.component';
import { EditorPreviewComponent } from './components/editor-preview/editor-preview.component';
import { EditorComponent } from './components/editor/editor.component';
import { OptionComponent, SelectComponent } from './components/select/select.component';


@NgModule({
  declarations: [
    // Editor
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    // Preview
    EditorPreviewComponent,
    // Control alignment
    ControlBreakLineComponent,
    ControlHorizontalDividerComponent,
    ControlSpacerComponent,
    ControlVerticalDividerComponent,
    // Controls
    BoldControlComponent,
    BulletListControlComponent,
    HeadingControlComponent,
    ItalicControlComponent,
    NumberListControlComponent,
    TextAlignControlComponent,
    UnderlineControlComponent,
    // Common
    OptionComponent,
    SelectComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    // Editor
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    // Preview
    EditorPreviewComponent,
    // Control alignment
    ControlBreakLineComponent,
    ControlHorizontalDividerComponent,
    ControlSpacerComponent,
    ControlVerticalDividerComponent,
    // Controls
    BoldControlComponent,
    BulletListControlComponent,
    HeadingControlComponent,
    ItalicControlComponent,
    NumberListControlComponent,
    TextAlignControlComponent,
    UnderlineControlComponent,
    // Common
    OptionComponent,
    SelectComponent,
  ]
})
export class NgxTipTapEditorModule {
}
