import { Injectable } from '@angular/core';
import { AnyExtension, Attributes, KeyboardShortcutCommand, mergeAttributes, Node } from '@tiptap/core';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import { DOMOutputSpec, Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';
import { BaseExtension } from '../base-extension';

export type MentionOptions = {
  HTMLAttributes: Record<string, any>,
  renderLabel: (props: {
    options: MentionOptions,
    node: ProseMirrorNode,
  }) => string,
  suggestion: Omit<Omit<SuggestionOptions, 'editor'>, 'render'>,
};

@Injectable()
export class NgxMention extends BaseExtension<MentionOptions> {

  public createExtension(extensionOptions: MentionOptions): AnyExtension {
    return Node.create<MentionOptions>({
      name: 'mention',
      group: 'inline',
      inline: true,
      selectable: false,
      atom: true,

      defaultOptions: {
        HTMLAttributes: {},
        renderLabel({options, node}): string {
          return `${options.suggestion.char}${node.attrs.label ?? node.attrs.id}`;
        },
        suggestion: {
          char: '@',
          command: ({editor, range, props}): void => {
            editor.chain().focus()
              .insertContentAt(range, [{
                type: 'mention',
                attrs: props,
              }, {
                type: 'text',
                text: ' ',
              }])
              .run();
          },
          allow: ({editor, range}) => {
            return editor.can().insertContentAt(range, {type: 'mention'});
          },
        },
      },

      addAttributes(): Attributes | {} {
        return {
          id: {
            default: null,
            parseHTML: element => {
              return {
                id: element.getAttribute('data-id'),
              };
            },
            renderHTML: attributes => {
              if (!attributes.id) {
                return {};
              }

              return {
                'data-id': attributes.id,
              };
            },
          },

          label: {
            default: null,
            parseHTML: element => {
              return {
                label: element.getAttribute('data-label'),
              };
            },
            renderHTML: attributes => {
              if (!attributes.label) {
                return {};
              }

              return {
                'data-label': attributes.label,
              };
            },
          },
        };
      },

      parseHTML(): NodeSpec['parseDOM'] {
        return [{
          tag: 'span[data-mention]',
        }];
      },

      renderHTML({node, HTMLAttributes}): DOMOutputSpec {
        return [
          'span',
          mergeAttributes({'data-mention': ''}, this.options.HTMLAttributes, HTMLAttributes),
          this.options.renderLabel({
            options: this.options,
            node,
          }),
        ];
      },

      renderText({node}): string {
        return this.options.renderLabel({
          options: this.options,
          node,
        });
      },

      addKeyboardShortcuts(): Record<string, KeyboardShortcutCommand> {
        return {
          Backspace: () => this.editor.commands.command(({tr, state}) => {
            let isMention = false;
            const {selection} = state;
            const {empty, anchor} = selection;

            if (!empty) {
              return false;
            }

            state.doc.nodesBetween(anchor - 1, anchor, (node, pos): boolean | void => {
              if (node.type.name === this.name) {
                isMention = true;
                tr.insertText(this.options.suggestion.char || '', pos, pos + node.nodeSize);

                return false;
              }
            });

            return isMention;
          }),
        };
      },

      addProseMirrorPlugins(): Plugin[] {
        return [
          Suggestion({
            editor: this.editor,
            items: query => {
              return [
                'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder',
              ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
            },
            render: () => {
              return {
                onStart: props => {
                  // TODO insert component into dom
                  // console.log('start', props);
                },
                onUpdate: props => {
                  // TODO Update the component search result
                  // console.log('update', props);
                },
                onKeyDown: props => {
                  // TODO check if the component handles the key press
                  // console.log('keydown', props);
                  return false;
                },
                onExit: props => {
                  // TODO get the selected result and remove the component
                  // I don't know why, but without the set timeout the dom seems to be not ready and prosemirror cannot find
                  // the corresponding dom element
                  setTimeout(() => {
                    props.command({id: 'hello', label: 'world'});
                  });
                  // console.log('exit', props);
                }
              };
            },
            ...this.options.suggestion,
          }),
        ];
      },
    }).configure(extensionOptions);
  }
}
