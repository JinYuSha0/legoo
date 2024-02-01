import {isNil} from './isNil';

export function removeNilField<T extends Record<string, any>>(obj: T): T {
  const keys = Object.keys(obj);
  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      const fieldName = keys[i];
      if (isNil(obj[fieldName])) delete obj[fieldName];
    }
  }
  return obj;
}
