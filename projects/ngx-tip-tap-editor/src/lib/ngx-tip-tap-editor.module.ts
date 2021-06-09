import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { EditorBodyComponent } from './components/editor-body/editor-body.component';
import { EditorHeaderComponent } from './components/editor-header/editor-header.component';
import { EditorPreviewComponent } from './components/editor-preview/editor-preview.component';
import { EditorComponent } from './components/editor/editor.component';
import { OptionDirective, SelectComponent } from './components/select/select.component';


@NgModule({
  declarations: [
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    EditorPreviewComponent,
    SelectComponent,
    OptionDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    EditorPreviewComponent
  ]
})
export class NgxTipTapEditorModule {
}
