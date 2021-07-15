import { DOCUMENT } from '@angular/common';
import { ComponentRef, Inject, Injectable, Injector, NgZone, Type } from '@angular/core';
import { AnyExtension, Editor, Range, RawCommands } from '@tiptap/core';
import { Mention, MentionOptions } from '@tiptap/extension-mention';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { AdvancedBaseExtension } from '../../base-extension';
import {
  MENTION_FETCH,
  MentionFetchFunction,
  MentionPreviewComponent,
  MentionPreviewInterface
} from './mention-preview.component';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mention: {
      setMention: (attributes: { range?: Range | number, props: { id: string, label?: string } }) => ReturnType,
    };
  }
}

interface NgxMentionOptions {
  previewComponent?: Type<MentionPreviewInterface>;
  HTMLAttributes?: Record<string, any>;
  renderLabel?: (props: {
    options: MentionOptions,
    node: ProseMirrorNode,
  }) => string;
  mentionFetchFunction: MentionFetchFunction;
}

// @dynamic
@Injectable()
export class NgxMention extends AdvancedBaseExtension<NgxMentionOptions> {

  public defaultOptions = {
    HTMLAttributes: {class: 'mention'},
    previewComponent: MentionPreviewComponent
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

  public createExtension(extensionOptions: Required<NgxMentionOptions>): AnyExtension {

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
            let component: ComponentRef<MentionPreviewInterface>;
            let remove: { remove: () => void; };
            return this.ngZone.run(() => ({
              onStart: props => {
                component = this.createComponent(extensionOptions.previewComponent, [{
                  provide: Editor,
                  useValue: props.editor
                }, {
                  provide: MENTION_FETCH,
                  useValue: extensionOptions.mentionFetchFunction
                }]);
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
              },
            }));
          },
        },
        ...extensionOptions
      },
    );
  }
}
