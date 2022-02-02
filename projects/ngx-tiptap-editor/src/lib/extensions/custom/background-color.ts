import {Extension} from '@tiptap/core';
import '@tiptap/extension-text-style';
import {GlobalAttributes, RawCommands} from '@tiptap/core/dist/packages/core/src/types';

export type BackgroundColorOptions = {
  types: string[],
};

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    backgroundColor: {
      /**
       * Set the background color
       */
      setBgColor: (backgroundColor: string) => ReturnType,
      /**
       * Unset the background color
       */
      unsetBgColor: () => ReturnType,
    };
  }
}

export const BackgroundColor = Extension.create<BackgroundColorOptions>({
  name: 'backgroundColor',

  addOptions(): BackgroundColorOptions {
    return {
      types: ['textStyle'],
    };
  },

  addGlobalAttributes(): GlobalAttributes | {} {
    return [
      {
        types: this.options.types,
        attributes: {
          backgroundColor: {
            default: null,
            parseHTML: element => element.style.backgroundColor.replace(/['"]+/g, ''),
            renderHTML: attributes => {
              if (!attributes.backgroundColor) {
                return {};
              }

              return {
                style: `background-color: ${attributes.backgroundColor}`,
              };
            },
          },
        },
      },
    ];
  },

  addCommands(): Partial<RawCommands> {
    return {
      setBgColor: backgroundColor => ({chain}) => {
        return chain()
          .setMark('textStyle', {backgroundColor})
          .run();
      },
      unsetBgColor: () => ({chain}) => {
        return chain()
          .setMark('textStyle', {backgroundColor: null})
          .removeEmptyTextStyle()
          .run();
      },
    };
  },
});
