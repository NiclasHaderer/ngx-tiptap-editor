import { DOCUMENT } from '@angular/common';
import { ComponentRef, Inject, Injectable, Injector, NgZone } from '@angular/core';
import { AnyExtension, Range, RawCommands } from '@tiptap/core';
import { Mention, MentionOptions } from '@tiptap/extension-mention';
import { AdvancedBaseExtension } from '../../base-extension';
import { MentionPreviewComponent } from './mention-preview.component';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mention: {
      /**
       * Toggle a paragraph
       */
      setMention: (attributes: { range?: Range | number, props: { id: string, label?: string } }) => ReturnType,
    };
  }
}

// @dynamic
@Injectable()
export class NgxMention extends AdvancedBaseExtension<MentionOptions> {

  public defaultOptions = {
    HTMLAttributes: {class: 'mention'}
  };

  constructor(
    protected injector: Injector,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  public onEditorReady(): void {
  }

  public createExtension(extensionOptions: Partial<MentionOptions>): AnyExtension {

    const extendedMention = Mention.extend({
      addCommands(): Partial<RawCommands> {
        return {
          setMention: ({range, props}) => ({commands, state}) => {

            // If range was not provided just insert at the current position
            if (!range) range = state.selection;

            return commands.insertContentAt(range, [
              {
                type: 'mention',
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ]);
          }
        };
      }
    });

    return extendedMention.configure({
        suggestion: {
          render: () => {
            let component: ComponentRef<MentionPreviewComponent>;
            let remove: { remove: () => void; };
            return this.ngZone.run(() => ({
              onStart: props => {
                component = this.createComponent(MentionPreviewComponent);
                component.instance.updateProps(props);
                remove = this.insertComponent(component, this.document.body);
              },
              onKeyDown: (props) => {
                return component.instance.handleKeyPress(props.event);
              },
              onUpdate: props => {
                component.instance.updateProps(props);
              },
              onExit: props => {
                remove.remove();
                props.editor.chain().setMention({props: {id: 'hello'}}).run();
              },
            }));
          },
          ...extensionOptions.suggestion
        },
        ...extensionOptions,
      },
    );
  }
}
