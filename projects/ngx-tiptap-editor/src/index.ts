/*
 * Public API Surface of ngx-tiptap-editor
 */

// Module
export { NgxTipTapEditorModule } from './lib/ngx-tiptap-editor.module';

// Editor
export { EditorComponent } from './lib/components/editor/editor.component';
export { EditorBodyComponent } from './lib/components/editor-body/editor-body.component';
export { EditorHeaderComponent } from './lib/components/editor-header/editor-header.component';

// Preview
export { EditorPreviewComponent } from './lib/components/editor-preview/editor-preview.component';
export { SideBySideComponent } from './lib/components/side-by-side/side-by-side.component';

// Control alignment
export { UtilBreakLineComponent } from './lib/components/editor-header/utils/util-break-line.component';
export {
  UtilHorizontalDividerComponent
} from './lib/components/editor-header/utils/util-horizontal-divider.component';
export { UtilPaddingComponent } from './lib/components/editor-header/utils/util-padding.component';
export { UtilSpacerComponent } from './lib/components/editor-header/utils/util-spacer.component';
export {
  UtilVerticalDividerComponent
} from './lib/components/editor-header/utils/util-vertical-divider.component';


// Controls
export {
  BaseControl, ButtonBaseControl, ExtendedBaseControl, SelectBaseControl
} from './lib/components/editor-header/controls/base-control';
export { ControlBoldComponent } from './lib/components/editor-header/controls/control-bold.component';
export { ControlBulletListComponent } from './lib/components/editor-header/controls/control-bullet-list.component';
export { ControlCodeBlockComponent } from './lib/components/editor-header/controls/control-code-block.component';
export { ControlCodeComponent } from './lib/components/editor-header/controls/control-code.component';
export { ControlFormatComponent } from './lib/components/editor-header/controls/control-format.component';
export { HorizontalRuleControlComponent } from './lib/components/editor-header/controls/control-hr.component';
export { ControlItalicComponent } from './lib/components/editor-header/controls/control-italic.component';
export { ControlLinkComponent } from './lib/components/editor-header/controls/control-link.component';
export {
  ControlMentionComponent, MentionCallback
} from './lib/components/editor-header/controls/control-mention.component';
export { ControlNumberListComponent } from './lib/components/editor-header/controls/control-number-list.component';
export { ControlStrikeComponent } from './lib/components/editor-header/controls/control-strike.component';
export { ControlTasklistComponent } from './lib/components/editor-header/controls/control-tasklist.component';
export { ControlTextAlignComponent } from './lib/components/editor-header/controls/control-text-align.component';
export { ControlUnderlineComponent } from './lib/components/editor-header/controls/control-underline.component';

// Common
export { SelectComponent, OptionComponent } from './lib/components/select/select.component';

// Services
export { TiptapEventService } from './lib/services/tiptap-event.service';
export { TiptapExtensionService } from './lib/services/tiptap-extension.service';
export { GLOBAL_ANGULAR_EXTENSIONS, GLOBAL_EXTENSIONS } from './lib/providers';

// Extensions
export { NgxMention, MentionData } from './lib/extensions/custom/mention/ngx-mention';
export {
  MentionPreviewInterface, MentionFetchFunction
} from './lib/extensions/custom/mention/mention-preview.component';
export { NgxLink, NgxLinkOptions } from './lib/extensions/custom/ngx-link';
export { TipBaseExtension, AdvancedBaseExtension } from './lib/extensions/tip-base-extension';
