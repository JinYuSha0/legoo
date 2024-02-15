import {isNil} from './isNil';
import {isArray} from './isArray';
import {isString} from './isString';
import {isPlainObject} from './isPlainObj';

export function isEmpty(value: any) {
  if (isNil(value)) return true;
  if (isArray(value) || isString(value)) {
    return !value.length;
  }
  if (isPlainObject(value)) {
    return !Object.keys(value).length;
  }
  return false;
}
