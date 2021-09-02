# Documentation

## Basic Usage

### Components

Import the `NgxTipTapEditorModule` in the module you want to use the editor in.

*app.module.ts*

```typescript
import { NgxTipTapEditorModule } from 'ngx-tiptap-editor';

@NgModule({
  declarations: [
    // ...
  ],
  imports: [
    // ...
    NgxTipTapEditorModule,
  ],
  // ...
})
export class SomeModule {
}
```

*app.component.ts*

```typescript
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  // The extension you want to pass to the editor
  public extensions: Extensions = [
    StarterKit,
    Underline,
    // Configure the tiptap Extension
    TaskItem.configure({nested: true}),
    TaskList,
    TaskItem,
  ];
  public angularExtensions = [
    // Create the angular extensions you want to use 
    BaseExtension.create(NgxMention, {HTMLAttributes: {class: 'mention'}}),
    BaseExtension.create(NgxLink, {openOnClick: false})
  ];
}
```

Use the `tip-editor`, the `tip-editor-header` and the `tip-editor-body` as well as different controls to create a basic
editor.

*app.component.html*

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

### Configure style

#### Import

*styles.scss*

```scss
// Include the editor theme
@use "ngx-tiptap-editor/editor";

// Import the editor theme
@include editor.import-theme();

// Remove the focus ring in the editor if you want to
@include editor.remove-focus-ring();
```

#### Customize

You can style most of the editor to your own liking with css variables. Just overwrite the default ones in your
*styles.scss*.

```css
  :root {
  --tip-active-color: #06c;
  --tip-warn-color: #ff6666;
  --tip-border-color: lightgray;
  --tip-border-radius: 10px;
  --tip-disabled-color: var(--tip-border-color);
  --tip-text-color: #000;
  --tip-background-color: #fff;
  --tip-header-height: 46px;
  --tip-header-padding: 0.5rem;
  --tip-overlay-color: rgba(0, 0, 0, .2);
  --tip-select-preview-height: 24px;
}
```

### Result:

![basic editor](https://i.imgur.com/8vHaG3J.png)

## Parameters and Events

### tip-editor

#### Input

| name                    | type                   | default | description                                                                                              |
| ----------------------- | ---------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| runEventsOutsideAngular | boolean                | true    | If you want the event to be emitted in the ngZone you have to pass true, otherwise they will run outside |
| content                 | string or json or null | null    | The content you want the editor to have after the initial load                                           |
| injectCSS               | bool                   | true    | Should some default css be injected                                                                      |
| autofocus               | bool                   | true    | Autofocus the editor as soon as the editor element appears                                               |
| editable                | bool                   | true    | Should the editor be editable or read only                                                               |
| editorProps             | EditorPros             | {}      | See https://www.tiptap.dev/api/editor/#editor-props                                                      |
| parseOptions            | ParseOptions           | {}      | See https://www.tiptap.dev/api/editor/#parse-options                                                     |
| enableInputRules        | bool                   | true    | Convert [] to checkbox for example                                                                       |
| enablePasteRules        | bool                   | true    | Convert a url to a link on paste                                                                         |
| extensions              | AnyExtension[]         | []      | A list of TipTap Extension (You have to pass some for the editor to work)                                |
| angularExtensions       | BaseExtension<any>     | []      | A list of extensions which can are integrated in into angular                                            |

#### Output

| name            | type                                         | description                                   |
| --------------- | -------------------------------------------- | --------------------------------------------- |
| beforeCreate    | { editor: Editor }                           | See https://www.tiptap.dev/api/events/#events |
| create          | { editor: Editor }                           | See https://www.tiptap.dev/api/events/#events |
| update          | { editor: Editor }                           | See https://www.tiptap.dev/api/events/#events |
| selectionUpdate | { editor: Editor }                           | See https://www.tiptap.dev/api/events/#events |
| transaction     | { editor: Editor, transaction: Transaction } | See https://www.tiptap.dev/api/events/#events |
| focus           | { editor: Editor, event: FocusEvent }        | See https://www.tiptap.dev/api/events/#events |
| blur            | { editor: Editor, event: FocusEvent }        | See https://www.tiptap.dev/api/events/#events |
| destroy         | {}                                           | See https://www.tiptap.dev/api/events/#events |
| created         | Editor                                       | The editor was created and set                |
| jsonChange      | Record<string, any>                          | The editor content as json                    |
| htmlChange      | string                                       | The editor content as html string             |

### tip-editor-header

#### Controls

The editor itself has no parameters, but you can pass different controls to the editor, by making them a child of
the `tip-editor-header` element.  
There are already a lot of controls available which you can use to create your editor. For a list of all controls look
at the controls [folder]( 2../projects/ngx-tiptap-editor/src/lib/components/editor-header/controls).

Partial list:

+ **tip-control-bold:** Toggle bold
+ **tip-control-bullet-list:** Toggle the bullet list
+ **tip-control-code-block:** Toggle the code block
+ **tip-control-code:** Toggle `code` font
+ **tip-control-format:** Select if the text should be a heading or a paragraph
+ **tip-control-hr:** Inserts a horizontal divider
+ **tip-control-italic:** Toggle italic
+ **tip-control-link:** Opens a dialog for creating a link
+ **tip-control-mention:**
+ **tip-control-number-list:** Toggles numbered enumeration
+ **tip-control-strike:** Toggle strike through mode
+ **tip-control-tasklist:** Toggle the task list
+ **tip-control-text-align:** Select the text alignment
  + To replace the icons simply place an html element in the tip-control-text-align
  + `<span data-left>left</span>`
  + `<span data-right>right</span>`
  + `<span data-center>center</span>`
  + `<span data-justify>justify</span>`
+ **tip-control-underline:** Toggle underline mode

#### Utils

To help you align the controls where you want them there are a
few [utils](../projects/ngx-tiptap-editor/src/lib/components/editor-header/utils) which will make your life easier.

Partial list:

+ **tip-util-br:** Breaks the row of controls and starts a new control row
+ **tip-util-hr:** Breaks the row of controls with a divider line
+ **tip-util-spacer:** Spaces the controls on each side of the spacer equally far apart
+ **tip-util-vr:** Creates a vertical divider line without spacing or breaking the row

### tip-editor-body

#### Input

| name      | type   | default | description                                                                                             |
| --------- | ------ | ------- | ------------------------------------------------------------------------------------------------------- |
| minHeight | string | ''      | The minimum height of the editor input (both have to be set in order to work properly, can be the same) |
| maxHeight | string | ''      | The maximum height of the editor input (both have to be set in order to work properly, can be the same) |

## Create custom controls

If you want to add your own control for an extension you can do it very easily. Please be aware that the control you
will create will feel unlike most angular-components you have written, because the control will not rely on the angular
change detection system to update the state of it, because otherwise the change detection would have to run every
key/mouse press

```typescript
export class FancyControl extends BaseControl {
  // Every base control has the onEditorReady lifecycle method which will be called if the editor has been injected
  public onEditorReady(editor: Editor): void {
    // Do some stuff
  }
}
```

### Button control

```typescript
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from 'ngx-tiptap-editor';
import { BaseControl, ButtonBaseControl } from 'ngx-tiptap-editor';

@Component({
  selector: 'tip-control-bold',
  // Use this style to create a uniform look
  styleUrls: ['ngx-tiptap-editor/src/lib/components/editor-header/controls/_styles.scss'],
  template: `
    <!--                                          Tag the button with the #button -->
    <button type="button" (click)="toggleBold()" #button>
      <!-- add your custom icon -->
      <i class="material-icons">format_bold</i>
    </button>
  `,
  // Set your change detection to OnPush
  changeDetection: ChangeDetectionStrategy.OnPush,
  // IMPORTANT: Only with this line will I be able to inject the editor instance into this component
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlBoldComponent)}],
})
// You have to extend the ButtonBaseControl so it deals with updating the template for you
export class ControlBoldComponent extends ButtonBaseControl implements OnInit, OnDestroy {
  constructor(
    // Provide the eventService for the super class
    protected eventService: TiptapEventService
  ) {
    super();
  }

  // Depends on the action you want to achieve
  public toggleBold(): void {
    this.editor && this.editor.chain().focus().toggleBold().run();
  }

  // Abstract method (checks if the current control is active)
  protected isActive(): boolean {
    return !!this.editor?.isActive('bold');
  }

  // Abstract method (checks if the current control can be activated)
  protected can(): boolean {
    return !!this.editor?.can().toggleBold();
  }
}
```

### Select Control

```typescript
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { TiptapEventService } from 'ngx-tiptap-editor';
import { BaseControl, SelectBaseControl } from 'ngx-tiptap-editor';

@Component({
  selector: 'tip-control-text-align',
  // Use this style to create a uniform look
  styleUrls: ['_styles.scss'],
  template: `
    <!-- Create a select which allows you to customize different parameters like if the select dropdown icon should be show, -->
    <!-- How wide the select is and what the default value of the select should be and listen for changes of the select -->
    <tip-select defaultValue="left" width="auto" [showIcon]="false"
                (change)="setAlign($event)">
      <!-- Pass different options to the select and specify if the html value should be used in the selection preview -->
      <tip-option value="left" [useHtml]="true" [enforceHeight]="true">
        <i class="material-icons">format_align_left</i>
      </tip-option>
      <tip-option value="right" [useHtml]="true" [enforceHeight]="true">
        <i class="material-icons">format_align_right</i>
      </tip-option>
      <tip-option value="center" [useHtml]="true" [enforceHeight]="true">
        <i class="material-icons">format_align_center</i>
      </tip-option>
      <tip-option value="justify" [useHtml]="true" [enforceHeight]="true">
        <i class="material-icons">format_align_justify</i>
      </tip-option>
    </tip-select>
  `,
  // Set your change detection to OnPush
  changeDetection: ChangeDetectionStrategy.OnPush,
  // IMPORTANT: Only with this line will I be able to inject the editor instance into this component
  providers: [{provide: BaseControl, useExisting: forwardRef(() => ControlTextAlignComponent)}],
})
export class ControlTextAlignComponent extends SelectBaseControl {
  // Basically the values of the different options. Passed to the canStyle method to determine if the options should be disabled, 
  // because the editor would not be able to display the change  
  protected canStyleParams = ['left', 'right', 'center', 'justify'];

  constructor(
    // Provide the eventService for the super class
    protected eventService: TiptapEventService
  ) {
    super();
  }

  // Whatever function you want to achieve
  public setAlign(alignment: 'justify' | 'left' | 'center' | 'right'): void {
    this.editor && this.editor.chain().focus().setTextAlign(alignment).run();
  }

  // Checks if the editor is able to perform a specific option
  protected canStyle(alignment: 'justify' | 'left' | 'center' | 'right'): boolean {
    if (!this.editor) return false;
    return this.editor.can().setTextAlign(alignment);
  }

  // Get the currently active value
  // This value will be used to update the currently active value of the select element
  protected currentActive(): 'left' | 'right' | 'center' | 'justify' | null {
    if (this.editor) {
      if (this.editor.isActive({textAlign: 'left'})) return 'left';
      if (this.editor.isActive({textAlign: 'right'})) return 'right';
      if (this.editor.isActive({textAlign: 'center'})) return 'center';
      if (this.editor.isActive({textAlign: 'justify'})) return 'justify';
    }
    return null;
  }
}
```

### Any other control

If you don't have a select, or a button use the BaseControl in order to get the editor injected in your component.

```typescript
import { ChangeDetectionStrategy, Component, forwardRef } from '@angular/core';
import { Editor } from '@tiptap/core';
import { TiptapEventService } from 'ngx-tiptap-editor';
import { BaseControl } from 'ngx-tiptap-editor';

@Component({
  selector: 'your fancy selector',
  styleUrls: ['your fancy styles'],
  template: `your fancy template`,
  // IMPORTANT: Only with this line will I be able to inject the editor instance into this component
  providers: [{provide: BaseControl, useExisting: forwardRef(() => FancyControl)}],
})
// You have to extend the BaseControl so the editor can be injected in the component
export class FancyControl extends BaseControl {
  public onEditorReady(editor: Editor): void {
    // Do some stuff
  }
}
```

## Create custom extensions

Sometimes you have to create an extension which will interact with other angular Components or Services. In this case It
would be clever to use the Extension API for angular extensions.  
This library provides two classes which should be extended in order to get the Angular Extensions to work.
The `BaseExtension` and the `AdvancedBaseExtension` which provides the functionality to create and inject every
component you want into the dom (a bit like a React portal).

*your-extension.ts*

```typescript
// Decorate the class with the @Injectable() decorator so when the Extension will be created dynamically the 
// Dependency injeciton works
import { HttpClient } from '@angular/common/http';
import { BaseExtension } from 'ngx-tiptap-editor';

@Injectable()
// Extend the BaseExtension or the ExtendedBaseExtension and pass the Options you want to provide for the user.
// The options interface will be used in the `createExtension` method and during the construction of the Angular Extension
export class YourExtension extends BaseExtension<NgxLinkOptions> {
  // The partial options object. This parital options object will be used as default options in case the user does not provide his own options.
  // These options will be merged with the user options and passed to the `createExtension` method.
  // The merged options will also be accessable in the options property of BaseExtension
  public defaultOptions: Partial<NgxLinkOptions> = {
    inputPlaceholder: 'Input link',
    popupText: 'Input your link',
  };

  constructor(
    // Inject everything you want to inject into your component
    private http: HttpClient
  ) {
    super();
  }

  /**
   * This method HAS to create the native TipTap extension which will be saved in the nativeExtension property of BaseExtension
   * @param extensionOptions Some options for the extension and your Angular Extension wrapper (will be saved in BaseExtension.options)
   */
  public createExtension(extensionOptions: NgxLinkOptions): AnyExtension {
    return Link.configure(extensionOptions);
  }

  // Hook which will be called as soon as the editor is injected in your Custom Extension
  public onEditorReady(): void {
  }

  // Hook which will be called when the editor gets destroyed
  public onEditorDestroy(): any {
  }

}
```

*app-editor.component.ts*

```typescript
@Component({
  // ...
})
export class AppEditorComponent implements OnInit {

  public ngOnInit(): void {
    // Create an extension builder with the BaseExtension factory method
    const angularExtension = BaseExtension.create(YourExtension, {
      // Whatever options you have to pass
    })
  }

}


```
