import { mergeAttributes, Node } from '@tiptap/core';
import { Attributes, KeyboardShortcutCommand } from '@tiptap/core/dist/packages/core/src/types';
import Suggestion, { SuggestionOptions } from '@tiptap/suggestion';
import { DOMOutputSpec, Node as ProseMirrorNode, NodeSpec } from 'prosemirror-model';
import { Plugin } from 'prosemirror-state';

export type MentionOptions = {
  HTMLAttributes: Record<string, any>,
  renderLabel: (props: {
    options: MentionOptions,
    node: ProseMirrorNode,
  }) => string,
  suggestion: Omit<Omit<SuggestionOptions, 'editor'>, 'render'>,
};

export const NgxMention = Node.create<MentionOptions>({
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
            'Lea Thompson', 'Cyndi Lauper', 'Tom Cruise', 'Madonna', 'Jerry Hall', 'Joan Collins', 'Winona Ryder', 'Christina Applegate', 'Alyssa Milano', 'Molly Ringwald', 'Ally Sheedy', 'Debbie Harry', 'Olivia Newton-John', 'Elton John', 'Michael J. Fox', 'Axl Rose', 'Emilio Estevez', 'Ralph Macchio', 'Rob Lowe', 'Jennifer Grey', 'Mickey Rourke', 'John Cusack', 'Matthew Broderick', 'Justine Bateman', 'Lisa Bonet',
          ].filter(item => item.toLowerCase().startsWith(query.toLowerCase())).slice(0, 10);
        },
        render: () => {
          return {
            onStart: props => {
              // console.log('start', props);
            },
            onUpdate: props => {
              // console.log('update', props);
            },
            onKeyDown: props => {
              // console.log('keydown', props);
              return false;
            },
            onExit: props => {
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
});
