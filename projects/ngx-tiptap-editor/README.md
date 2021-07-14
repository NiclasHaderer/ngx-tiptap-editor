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
    <tip-control-text-align></tip-control-text-align>
    <tip-control-underline></tip-control-underline>
    <tip-control-italic></tip-control-italic>
    <tip-control-bold></tip-control-bold>
    <tip-util-vr></tip-util-vr>
    <!--  right  -->
    <tip-util-spacer></tip-util-spacer>
    <tip-util-vr></tip-util-vr>
    <tip-bullet-list-control></tip-bullet-list-control>
    <tip-control-number-list></tip-control-number-list>
    <tip-control-link></tip-control-link>
    <!--  new line  -->
    <tip-util-hr></tip-util-hr>
    <tip-control-strike></tip-control-strike>
    <tip-control-hr></tip-control-hr>
    <tip-util-vr></tip-util-vr>
    <tip-code-block-control></tip-code-block-control>
    <tip-control-code></tip-control-code>
    <tip-util-vr></tip-util-vr>
  </tip-editor-header>
  <tip-editor-body></tip-editor-body>
</tip-editor>
```

