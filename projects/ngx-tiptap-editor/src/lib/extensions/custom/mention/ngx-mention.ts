import { DOCUMENT } from '@angular/common';
import { ComponentRef, Inject, Injectable, Injector, NgZone, Type } from '@angular/core';
import { AnyExtension, Editor, mergeAttributes, Range, RawCommands } from '@tiptap/core';
import { Mention, MentionOptions } from '@tiptap/extension-mention';
import { Node as ProseMirrorNode } from 'prosemirror-model';
import { fromEvent, Subject, Subscription } from 'rxjs';
import { AdvancedBaseExtension } from '../../tip-base-extension';
import {
  MENTION_FETCH,
  MentionFetchFunction,
  MentionPreviewComponent,
  MentionPreviewInterface
} from './mention-preview.component';

export type MentionData = { id: string, label?: string } | { id: string, label: null; };

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    mention: {
      setMention: (attributes: { range?: Range | number, props: MentionData }) => ReturnType,
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
  mentionFetchFunction?: MentionFetchFunction;
}

// @dynamic
@Injectable()
export class NgxMention extends AdvancedBaseExtension<NgxMentionOptions> {

  // tslint:disable:member-ordering
  private _onClick$ = new Subject<MentionData>();
  public onClick$ = this._onClick$.asObservable();

  public defaultOptions = {
    HTMLAttributes: {class: 'mention'},
    previewComponent: MentionPreviewComponent
  };

  // tslint:enable:member-ordering

  constructor(
    protected injector: Injector,
    private ngZone: NgZone,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  public createExtension(extensionOptions: Required<NgxMentionOptions>): AnyExtension {
    const listeners: Subscription[] = [];
    const self = this;
    const extendedMention = Mention.extend({
      // Remove listeners
      onDestroy: () => listeners.forEach(l => l.unsubscribe()),
      renderHTML({node, HTMLAttributes}): any {

        const span = document.createElement('span');
        span.textContent = this.options.renderLabel({options: this.options, node});
        // Subscribe to click events and pass them to the onClick Subject
        const subscription = fromEvent(span, 'click').subscribe(() => self._onClick$.next(node.attrs as any));
        listeners.push(subscription);

        const attributes = mergeAttributes({'data-mention': ''}, this.options.HTMLAttributes, HTMLAttributes);
        Object.keys(attributes).forEach(key => span.setAttribute(key, attributes[key]));

        return span;
      },
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
      },
    });

    const mentionOptions: Partial<MentionOptions> = {
      ...extensionOptions,
    };


    // Check if the fetch function is provided and if not don't register events for it
    if (extensionOptions.mentionFetchFunction) {
      mentionOptions.suggestion = {
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
            onExit: () => {
              remove.remove();
            },
          }));
        },
        ...mentionOptions.suggestion
      };
    }


    return extendedMention.configure(mentionOptions);
  }
}
