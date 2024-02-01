import {isEmpty} from '../common';

export function paddingLeft(
  value: string | number,
  padding: number = 3,
  fill: string = '0',
) {
  if (isEmpty(value)) return value;
  let newValue = `${+value}`;
  const l = newValue.length;
  if (l < padding) {
    newValue = `${fill.repeat(padding - l)}${newValue}`;
  }
  return newValue;
}
