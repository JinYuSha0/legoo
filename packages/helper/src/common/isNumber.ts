import {isString} from './isString';

export function isNumber(value: any) {
  if (typeof value === 'number') return true;
  if (isString(value)) {
    return /^(-|\+)?\d*\.?\d+$/.test(value);
  }
  return false;
}
