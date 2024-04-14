import {isNumber, isString} from '../common';
import {removeNonNumber} from '../common/removeNonNumber';
import {Config} from '../config';

export function thousandsSeparator(
  n: number | string,
  spearator: string = Config.THOUSANDTHS_SEPARATOR,
): string {
  if (isString(n)) n = removeNonNumber(n);
  if (!isNumber(n)) return String(Config.DEFAULT_SAFE_VALUE);
  const [integer, decimal] = n.toString().split('.');
  const _decimal = decimal ? '.' + decimal : '';
  return integer.replace(/\B(?=(\d{3})+(?!\d))/g, spearator) + _decimal;
}
