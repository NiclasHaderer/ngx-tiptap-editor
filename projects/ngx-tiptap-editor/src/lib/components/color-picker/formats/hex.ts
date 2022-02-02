import {ColorFormats, deciToHex, isHex, isHSLA, isRgba} from './common';
import {RGBA, RgbaConverter} from './rgba';
import {HSLA} from './hsla';

export interface HEX {
  r: string;
  g: string;
  b: string;
  a: string;
}

export const HexConverter = {
  toHex(format: ColorFormats): HEX {
    if (isRgba(format)) {
      return this.fromRgb(format);
    } else if (isHex(format)) {
      return format;
    } else if (isHSLA(format)) {
      return this.fromHsla(format);
    }
    throw new Error('Format cannot be converted to hex');
  },
  toString(format: HSLA): string {
    const {r, g, b, a} = this.toHex(format);
    return `#${r}${g}${b}${a}`;
  },
  fromRgb: ({r, g, b, a}: RGBA) => ({
    r: deciToHex(r),
    g: deciToHex(g),
    b: deciToHex(b),
    a: deciToHex(a)
  }),
  fromHsla: (format: HSLA): HEX => {
    const rgba = RgbaConverter.fromHsla(format);
    return HexConverter.fromRgb(rgba);
  },
} as const;

