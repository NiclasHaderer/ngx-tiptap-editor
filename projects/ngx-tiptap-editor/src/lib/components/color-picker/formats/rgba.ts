import {ColorFormats, hexToDeci, isHex, isHSLA, isRgba} from './common';
import type {HEX} from './hex';
import {HSLA} from './hsla';

export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export const RgbaConverter = {
  toRgba(format: ColorFormats): RGBA {
    if (isRgba(format)) {
      return format;
    } else if (isHex(format)) {
      return this.fromHex(format);
    } else if (isHSLA(format)) {
      return this.fromHsla(format);
    }
    throw new Error('Format cannot be converted to rgba');
  },
  toString(format: ColorFormats): string {
    const {r, g, b, a} = this.toRgba(format);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  },
  fromHex: ({r, g, b, a}: HEX): RGBA => ({
    r: hexToDeci(r),
    g: hexToDeci(g),
    b: hexToDeci(b),
    a: hexToDeci(a)
  }),
  fromHsla(format: HSLA): RGBA {
    const c = (1 - Math.abs(2 * format.l - 1)) * format.s;
    const x = c * (1 - Math.abs(((format.h / 60) % 2) - 1));
    const m = format.l - c / 2;
    const h = format.h;
    let rLike: number;
    let gLike: number;
    let bLike: number;

    if (h <= 0 && h < 60) {
      rLike = c;
      gLike = x;
      bLike = 0;
    } else if (h <= 60 && h < 120) {
      rLike = x;
      gLike = c;
      bLike = 0;
    } else if (h <= 120 && h < 180) {
      rLike = 0;
      gLike = c;
      bLike = x;
    } else if (h <= 180 && h < 240) {
      rLike = 0;
      gLike = x;
      bLike = c;
    } else if (h <= 240 && h < 300) {
      rLike = x;
      gLike = 0;
      bLike = c;
    } else {
      rLike = c;
      gLike = 0;
      bLike = x;
    }


    return {
      r: Math.round((rLike + m) * 255),
      g: Math.round((gLike + m) * 255),
      b: Math.round((bLike + m) * 255),
      a: Math.round(format.a * 255),
    };
  }
};

