# NgxTipTapEditor

[![Build and Publish](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/publish.yml/badge.svg)](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/publish.yml)
[![Deploy to Github Pages](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/gh-pages.yml)
[![NPM package](https://img.shields.io/npm/v/ngx-tiptap-editor.svg?logo=npm&logoColor=fff&label=NPM+package&color=rgb(49,199,84))](https://www.npmjs.com/package/ngx-tiptap-editor)

## Example

```html
<!-- The main editor component (all inputs and events will be handled by this component) -->
<tip-editor (jsonChange)="save($event)" [content]="editorContent"
            [extensions]="extensions" [angularExtensions]="angularExtension">
  <!-- Editor Header: Pass the controls you want to display in the body -->
  <tip-editor-header>
    <tip-format-control>
      <!-- Pass your custom icons and replace the default ones -->
    </tip-format-control>
    <tip-control-text-align></tip-control-text-align>
    <tip-control-underline></tip-control-underline>
    <tip-control-italic></tip-control-italic>
    <tip-control-bold></tip-control-bold>
  </tip-editor-header>
  <!-- The body of the editor (used for displaying the actual writing panel -->
  <tip-editor-body></tip-editor-body>
</tip-editor>
```

![basic editor](https://i.imgur.com/8vHaG3J.png)

