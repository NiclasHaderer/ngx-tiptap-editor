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
import { ItemDividerComponent } from './components/editor-header/utils/item-divider.component';
import { ItemSpacerComponent } from './components/editor-header/utils/item-spacer.component';
import { EditorPreviewComponent } from './components/editor-preview/editor-preview.component';
import { EditorComponent } from './components/editor/editor.component';
import { OptionComponent, SelectComponent } from './components/select/select.component';


@NgModule({
  declarations: [
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    EditorPreviewComponent,
    ItalicControlComponent,
    UnderlineControlComponent,
    BoldControlComponent,
    HeadingControlComponent,
    BulletListControlComponent,
    NumberListControlComponent,
    TextAlignControlComponent,
    ItemSpacerComponent,
    ItemDividerComponent,
    SelectComponent,
    OptionComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    EditorPreviewComponent,
    ItalicControlComponent,
    UnderlineControlComponent,
    BoldControlComponent,
    HeadingControlComponent,
    BulletListControlComponent,
    NumberListControlComponent,
    TextAlignControlComponent,
    ItemSpacerComponent,
    ItemDividerComponent,
    SelectComponent,
    OptionComponent
  ]
})
export class NgxTipTapEditorModule {
}
