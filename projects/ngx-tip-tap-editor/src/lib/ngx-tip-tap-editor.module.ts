import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditorBodyComponent } from './components/editor-body/editor-body.component';
import { BoldControlComponent } from './components/editor-header/controls/bold-control.component';
import { HeadingControlComponent } from './components/editor-header/controls/heading.component';
import { ListControlComponent } from './components/editor-header/controls/list-control.component';
import { UnderlineControlComponent } from './components/editor-header/controls/underline-control.component';
import { EditorHeaderComponent } from './components/editor-header/editor-header.component';
import { EditorPreviewComponent } from './components/editor-preview/editor-preview.component';
import { EditorComponent } from './components/editor/editor.component';
import { OptionDirective, SelectComponent } from './components/select/select.component';
import { ItalicControlComponent } from './components/editor-header/controls/italic-control.component';


@NgModule({
  declarations: [
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    EditorPreviewComponent,
    SelectComponent,
    OptionDirective,
    ItalicControlComponent,
    UnderlineControlComponent,
    BoldControlComponent,
    HeadingControlComponent,
    ListControlComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    EditorPreviewComponent,
    SelectComponent,
    OptionDirective,
    ItalicControlComponent,
    UnderlineControlComponent,
    BoldControlComponent,
    HeadingControlComponent,
    ListControlComponent,
  ]
})
export class NgxTipTapEditorModule {
}
