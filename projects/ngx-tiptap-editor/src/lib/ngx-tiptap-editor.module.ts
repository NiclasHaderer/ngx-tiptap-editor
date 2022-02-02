import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ControlBoldComponent} from './components/controls/control-bold.component';
import {ControlBulletListComponent} from './components/controls/control-bullet-list.component';
import {ControlCodeBlockComponent} from './components/controls/control-code-block.component';
import {ControlCodeComponent} from './components/controls/control-code.component';
import {ControlFormatComponent} from './components/controls/control-format.component';
import {HorizontalRuleControlComponent} from './components/controls/control-hr.component';
import {ControlItalicComponent} from './components/controls/control-italic.component';
import {ControlLinkComponent} from './components/controls/control-link.component';
import {ControlMentionComponent} from './components/controls/control-mention.component';
import {ControlNumberListComponent} from './components/controls/control-number-list.component';
import {ControlStrikeComponent} from './components/controls/control-strike.component';
import {ControlTasklistComponent} from './components/controls/control-tasklist.component';
import {ControlTextAlignComponent} from './components/controls/control-text-align.component';
import {ControlUnderlineComponent} from './components/controls/control-underline.component';
import {DisplayCharacterCountComponent} from './components/controls/display-character-count.component';
import {DialogComponent} from './components/dialog/dialog.component';
import {PopoverComponent} from './components/dialog/popover.component';
import {EditorBodyComponent} from './components/editor-body/editor-body.component';
import {EditorFooterComponent} from './components/editor-footer/editor-footer.component';
import {EditorHeaderComponent} from './components/editor-header/editor-header.component';
import {EditorPreviewComponent} from './components/editor-preview/editor-preview.component';
import {EditorComponent} from './components/editor/editor.component';
import {LinkPreviewComponent} from './components/link/preview.component';
import {LinkSelectComponent} from './components/link/selection.component';
import {OptionComponent, SelectComponent} from './components/select/select.component';
import {SideBySideComponent} from './components/side-by-side/side-by-side.component';
import {UtilBreakLineComponent} from './components/utils/util-break-line.component';
import {UtilHorizontalDividerComponent} from './components/utils/util-horizontal-divider.component';
import {UtilPaddingComponent} from './components/utils/util-padding.component';
import {UtilSpacerComponent} from './components/utils/util-spacer.component';
import {UtilVerticalDividerComponent} from './components/utils/util-vertical-divider.component';
import {AutofocusDirective} from './directives/autofocus.directive';
import {MentionPreviewComponent} from './extensions/custom/mention/mention-preview.component';
import {TextColorComponent} from './components/controls/control-text-color';
import {BgColorComponent} from './components/controls/control-bg-color';


@NgModule({
  declarations: [
    // Editor
    EditorComponent,
    EditorBodyComponent,
    EditorHeaderComponent,
    EditorFooterComponent,
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
    BgColorComponent,
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
    TextColorComponent,
    ControlUnderlineComponent,
    ControlLinkComponent,
    // Display
    DisplayCharacterCountComponent,
    // Common
    OptionComponent,
    SelectComponent,
    DialogComponent,
    // Private
    LinkSelectComponent,
    AutofocusDirective,
    LinkPreviewComponent,
    PopoverComponent,
    MentionPreviewComponent,
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
    EditorFooterComponent,
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
    BgColorComponent,
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
    TextColorComponent,
    ControlUnderlineComponent,
    ControlLinkComponent,
    // Display
    DisplayCharacterCountComponent,
    // Common
    OptionComponent,
    SelectComponent,
  ],
  providers: []
})
export class NgxTipTapEditorModule {
}
