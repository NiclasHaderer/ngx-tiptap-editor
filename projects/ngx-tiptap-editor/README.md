# NgxTipTapEditor

[![Build and Publish](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/publish.yml/badge.svg)](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/publish.yml)
[![Deploy to Github Pages](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/gh-pages.yml/badge.svg)](https://github.com/HuiiBuh/ngx-tiptap-editor/actions/workflows/gh-pages.yml)
[![NPM package](https://img.shields.io/npm/v/ngx-tiptap-editor.svg?logo=npm&logoColor=fff&label=NPM+package&color=rgb(49,199,84))](https://www.npmjs.com/package/ngx-tiptap-editor)

## Features

+ Ease to use - If you don't want to create own extensions or controls you can simple paste the code below and it will
  work
+ Bring your own icons if you don't want to use the default ones
+ Customizable - Select which plugins/controls you want, and the order they are in
+ Performant - The update of the header controls is done outside of the angular change detection cycle to prevent change
  detection cycles running through the app every time the user types a letter
+ Extendable - Create your own Angular plugins for TipTap and pass them to the editor

## Installation

1. Install with `npm install ngx-tiptap-editor` or `yarn add ngx-tiptap-editor`.

## Example

A very basic example with only a few controls. To see the module import, and the typescript component take a look at
the [docs](docs/README.md).

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

## Documentation

See [here](docs/README.md)
