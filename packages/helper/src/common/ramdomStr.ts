import {isNil} from './isNil';

export function randomStr(length?: number): string {
  const str = Math.random().toString(36).split('.')[1];
  if (!isNil(length)) {
    return str.slice(0, length);
  }
  return str;
}
