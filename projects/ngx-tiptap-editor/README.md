# NgxTipTapEditor

[![Build and Publish](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/publish.yml/badge.svg)](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/publish.yml)
[![Deploy to Github Pages](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/gh-pages.yml)
[![NPM package](https://img.shields.io/npm/v/ngx-tiptap-editor.svg?logo=npm&logoColor=fff&label=NPM+package&color=rgb(49,199,84))](https://www.npmjs.com/package/ngx-tiptap-editor)

## Example

```html

<tip-editor (jsonChange)="save($event)" [content]="editorContent" [extensions]="extensions">
  <tip-editor-header>
    <!--  left  -->
    <tip-format-control></tip-format-control>
    <tip-text-align-control></tip-text-align-control>
    <tip-underline-control></tip-underline-control>
    <tip-italic-control></tip-italic-control>
    <tip-bold-control></tip-bold-control>
    <tip-control-vertical-divider></tip-control-vertical-divider>
    <!--  right  -->
    <tip-control-spacer></tip-control-spacer>
    <tip-control-vertical-divider></tip-control-vertical-divider>
    <tip-bullet-list-control></tip-bullet-list-control>
    <tip-number-list-control></tip-number-list-control>
    <tip-link-control></tip-link-control>
    <!--  new line  -->
    <tip-control-horizontal-divider></tip-control-horizontal-divider>
    <tip-strike-control></tip-strike-control>
    <tip-hr-control></tip-hr-control>
    <tip-control-vertical-divider></tip-control-vertical-divider>
    <tip-code-block-control></tip-code-block-control>
    <tip-code-control></tip-code-control>
    <tip-control-vertical-divider></tip-control-vertical-divider>
  </tip-editor-header>
  <tip-editor-body></tip-editor-body>
</tip-editor>
```
