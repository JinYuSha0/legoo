import {isNumber} from './isNumber';
import {isString} from './isString';

export function removeNonNumber(value?: string): string {
  if (isString(value)) {
    const maybeNumber = value.replace(/[^\d|\\.|-|\\+]/g, '');
    if (isNumber(maybeNumber)) return maybeNumber;
  }
  return '';
}
