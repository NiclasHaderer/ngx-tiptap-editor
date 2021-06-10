/*
 * Public API Surface of ngx-tip-tap-editor
 */


// Module
export { NgxTipTapEditorModule } from './lib/ngx-tip-tap-editor.module';

// Editor
export { EditorComponent } from './lib/components/editor/editor.component';
export { EditorBodyComponent } from './lib/components/editor-body/editor-body.component';
export { EditorHeaderComponent } from './lib/components/editor-header/editor-header.component';

// Preview
export { EditorPreviewComponent } from './lib/components/editor-preview/editor-preview.component';

// Control alignment
export { ControlBreakLineComponent } from './lib/components/editor-header/utils/control-break-line.component';
export {
  ControlHorizontalDividerComponent
} from './lib/components/editor-header/utils/control-horizontal-divider.component';
export { ControlSpacerComponent } from './lib/components/editor-header/utils/control-spacer.component';
export {
  ControlVerticalDividerComponent
} from './lib/components/editor-header/utils/control-vertical-divider.component';


// Controls
export { BaseControl } from './lib/components/editor-header/controls/base-control';
export { BoldControlComponent } from './lib/components/editor-header/controls/bold-control.component';
export { BulletListControlComponent } from './lib/components/editor-header/controls/bullet-list-control.component';
export { HeadingControlComponent } from './lib/components/editor-header/controls/heading.component';
export { ItalicControlComponent } from './lib/components/editor-header/controls/italic-control.component';
export { NumberListControlComponent } from './lib/components/editor-header/controls/number-list-control.component';
export { TextAlignControlComponent } from './lib/components/editor-header/controls/text-align.component';
export { UnderlineControlComponent } from './lib/components/editor-header/controls/underline-control.component';

// Common
export { OptionComponent } from './lib/components/select/select.component';
export { SelectComponent } from './lib/components/select/select.component';
