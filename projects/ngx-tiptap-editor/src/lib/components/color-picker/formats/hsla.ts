import {ColorFormats, isHex, isHSLA, isRgba} from './common';
import type {RGBA} from './rgba';
import {RgbaConverter} from './rgba';
import {HEX} from './hex';

export interface HSLA {
  h: number;
  s: number;
  l: number;
  a: number;
}


export const HslaConverter = {
  toHsla(format: ColorFormats): HSLA {
    if (isHSLA(format)) {
      return format;
    } else if (isRgba(format)) {
      return this.fromRGB(format);
    } else if (isHex(format)) {
      return this.fromHex(format);
    }
    throw new Error('Format cannot be converted to hsla');
  },
  toString(format: ColorFormats): string {
    const {h, s, l, a} = this.toHsla(format);
    return `hsla(${h}, ${s}%, ${l}%, ${a})`;
  },
  fromRGB(format: RGBA): HSLA {
    const rPercent = format.r / 255;
    const gPercent = format.g / 255;
    const bPercent = format.b / 255;
    const aPercent = format.a / 255;
    const max = Math.max(rPercent, gPercent, bPercent);
    const min = Math.max(rPercent, gPercent, bPercent);
    const delta = max - min;
    const lightness = (max + min) / 2;
    const saturation = delta / (1 - Math.abs(2 * lightness - 1));

    let hue: number;
    if (delta === 0) {
      hue = 0;
    } else if (max === rPercent) {
      hue = (((gPercent - bPercent) / delta)) % 6;
    } else if (max === gPercent) {
      hue = ((bPercent) - (rPercent)) / delta + 2;
    } else {
      hue = ((rPercent) - (gPercent)) / delta + 4;
    }

    hue = Math.round(hue * 60);

    // Make negative hues positive by adding 360deg
    if (hue < 0) {
      hue += 360;
    }

    return {
      h: hue,
      s: saturation,
      l: lightness,
      a: aPercent
    };
  },
  fromHex(format: HEX): HSLA {
    const rgba = RgbaConverter.fromHex(format);
    return this.fromRGB(rgba);
  }
};
