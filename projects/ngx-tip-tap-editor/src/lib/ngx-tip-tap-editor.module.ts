import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './components/dialog/dialog.component';
import { EditorBodyComponent } from './components/editor-body/editor-body.component';
import { BoldControlComponent } from './components/editor-header/controls/bold-control.component';
import { BulletListControlComponent } from './components/editor-header/controls/bullet-list-control.component';
import { FormatControlComponent } from './components/editor-header/controls/format-control.component';
import { ItalicControlComponent } from './components/editor-header/controls/italic-control.component';
import { LinkControlComponent, LinkSelectComponent } from './components/editor-header/controls/link-control.component';
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
import { SideBySideComponent } from './components/side-by-side/side-by-side.component';
import { AutofocusDirective } from './directives/autofocus.directive';


@NgModule({
  declarations: [
    // Editor
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    // Preview
    EditorPreviewComponent,
    SideBySideComponent,
    // Control alignment
    ControlBreakLineComponent,
    ControlHorizontalDividerComponent,
    ControlSpacerComponent,
    ControlVerticalDividerComponent,
    // Controls
    BoldControlComponent,
    BulletListControlComponent,
    FormatControlComponent,
    ItalicControlComponent,
    NumberListControlComponent,
    TextAlignControlComponent,
    UnderlineControlComponent,
    LinkControlComponent,
    // Common
    OptionComponent,
    SelectComponent,
    DialogComponent,
    // Private
    LinkSelectComponent,
    AutofocusDirective
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    BrowserModule,
    FormsModule
  ],
  exports: [
    // Editor
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    // Preview
    EditorPreviewComponent,
    SideBySideComponent,
    // Control alignment
    ControlBreakLineComponent,
    ControlHorizontalDividerComponent,
    ControlSpacerComponent,
    ControlVerticalDividerComponent,
    // Controls
    BoldControlComponent,
    BulletListControlComponent,
    FormatControlComponent,
    ItalicControlComponent,
    NumberListControlComponent,
    TextAlignControlComponent,
    UnderlineControlComponent,
    LinkControlComponent,
    // Common
    OptionComponent,
    SelectComponent,
  ],
  providers: []
})
export class NgxTipTapEditorModule {
}
