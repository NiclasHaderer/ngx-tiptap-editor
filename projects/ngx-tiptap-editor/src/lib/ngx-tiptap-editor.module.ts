import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogComponent } from './components/dialog/dialog.component';
import { PopoverComponent } from './components/dialog/popover.component';
import { EditorBodyComponent } from './components/editor-body/editor-body.component';
import { ControlBoldComponent } from './components/editor-header/controls/control-bold.component';
import { ControlBulletListComponent } from './components/editor-header/controls/control-bullet-list.component';
import { ControlCodeBlockComponent } from './components/editor-header/controls/control-code-block.component';
import { ControlCodeComponent } from './components/editor-header/controls/control-code.component';
import { ControlFormatComponent } from './components/editor-header/controls/control-format.component';
import { HorizontalRuleControlComponent } from './components/editor-header/controls/control-hr.component';
import { ControlItalicComponent } from './components/editor-header/controls/control-italic.component';
import { ControlLinkComponent } from './components/editor-header/controls/control-link.component';
import { ControlMentionComponent } from './components/editor-header/controls/control-mention.component';
import { ControlNumberListComponent } from './components/editor-header/controls/control-number-list.component';
import { ControlStrikeComponent } from './components/editor-header/controls/control-strike.component';
import { ControlTasklistComponent } from './components/editor-header/controls/control-tasklist.component';
import { ControlTextAlignComponent } from './components/editor-header/controls/control-text-align.component';
import { ControlUnderlineComponent } from './components/editor-header/controls/control-underline.component';
import { EditorHeaderComponent } from './components/editor-header/editor-header.component';
import { UtilBreakLineComponent } from './components/editor-header/utils/util-break-line.component';
import { UtilHorizontalDividerComponent } from './components/editor-header/utils/util-horizontal-divider.component';
import { UtilPaddingComponent } from './components/editor-header/utils/util-padding.component';
import { UtilSpacerComponent } from './components/editor-header/utils/util-spacer.component';
import { UtilVerticalDividerComponent } from './components/editor-header/utils/util-vertical-divider.component';
import { EditorPreviewComponent } from './components/editor-preview/editor-preview.component';
import { EditorComponent } from './components/editor/editor.component';
import { LinkPreviewComponent } from './components/link/preview';
import { LinkSelectComponent } from './components/link/selection';
import { OptionComponent, SelectComponent } from './components/select/select.component';
import { SideBySideComponent } from './components/side-by-side/side-by-side.component';
import { AutofocusDirective } from './directives/autofocus.directive';
import { MentionPreviewComponent } from './extensions/custom/mention/mention-preview.component';


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
    UtilBreakLineComponent,
    UtilHorizontalDividerComponent,
    UtilPaddingComponent,
    UtilSpacerComponent,
    UtilVerticalDividerComponent,
    // Controls
    ControlBoldComponent,
    ControlBulletListComponent,
    ControlCodeBlockComponent,
    ControlCodeComponent,
    ControlFormatComponent,
    HorizontalRuleControlComponent,
    ControlItalicComponent,
    ControlMentionComponent,
    ControlNumberListComponent,
    ControlStrikeComponent,
    ControlTasklistComponent,
    ControlTextAlignComponent,
    ControlUnderlineComponent,
    ControlLinkComponent,
    // Common
    OptionComponent,
    SelectComponent,
    DialogComponent,
    // Private
    LinkSelectComponent,
    AutofocusDirective,
    LinkPreviewComponent,
    PopoverComponent,
    MentionPreviewComponent
  ],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
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
    UtilBreakLineComponent,
    UtilHorizontalDividerComponent,
    UtilPaddingComponent,
    UtilSpacerComponent,
    UtilVerticalDividerComponent,
    // Controls
    ControlBoldComponent,
    ControlBulletListComponent,
    ControlCodeBlockComponent,
    ControlCodeComponent,
    ControlFormatComponent,
    HorizontalRuleControlComponent,
    ControlItalicComponent,
    ControlMentionComponent,
    ControlNumberListComponent,
    ControlStrikeComponent,
    ControlTasklistComponent,
    ControlTextAlignComponent,
    ControlUnderlineComponent,
    ControlLinkComponent,
    // Common
    OptionComponent,
    SelectComponent,
  ],
  providers: []
})
export class NgxTipTapEditorModule {
}
