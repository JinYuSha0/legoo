import {type Numeric} from 'decimal.js-light';
import {Config} from '../config';

export function toSafeNumber(
  n: Numeric,
  defaultValue = Config.DEFAULT_SAFE_VALUE,
): Numeric {
  if (Number.isNaN(+n)) {
    return defaultValue;
  }

  return n;
}
