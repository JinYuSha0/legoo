import {isString} from './isString';

export function removeSpace(value?: string): string {
  if (isString(value)) {
    return (value ?? '').replace(/\s/g, '');
  }
  return '';
}
