import {isNumber, isString} from '../common';
import {removeNonNumber} from '../common/removeNonNumber';
import {Config} from '../config';

export function thousandsSeparator(
  n: number | string,
  spearator: string = Config.THOUSANDTHS_SEPARATOR,
): string {
  if (isString(n)) n = removeNonNumber(n);
  if (!isNumber(n)) return String(Config.DEFAULT_SAFE_VALUE);
  const strSplit = n.toString().split('.');
  const integer = strSplit[0];
  const decimal = strSplit[1] || '';
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, spearator) + decimal;
}
