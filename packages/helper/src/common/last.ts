export function last<T extends ArrayLike<any>>(value: T): T[0] {
  return value[value.length - 1];
}
