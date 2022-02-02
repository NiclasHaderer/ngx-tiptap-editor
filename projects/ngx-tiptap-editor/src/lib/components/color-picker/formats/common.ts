import type {HEX} from './hex';
import type {RGBA} from './rgba';
import type {HSLA} from './hsla';

export type ColorFormats = HEX | RGBA | HSLA;

export const deciToHex = (num: number): string => {
  if (num < 0) num = Math.abs(num);
  return num.toString(16);
};

export const hexToDeci = (num: string): number => {
  return Math.abs(parseInt(num, 16));
};


export const isRgba = (format: ColorFormats): format is RGBA => 'r' in format && typeof format.r === 'number';
export const isHex = (format: ColorFormats): format is HEX => 'r' in format && typeof format.r === 'string';
export const isHSLA = (format: ColorFormats): format is HSLA => 'hue' in format;

