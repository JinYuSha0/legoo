type CurryFunc<T, First extends any[]> = T extends (
  ...args: infer Args
) => infer R
  ? Args extends [...First, infer Mid, ...infer Tail]
    ? (v: Mid) => CurryFunc<T, [...First, Mid]>
    : R
  : T;

export function curry<T extends (...args: any[]) => any, First extends any[]>(
  fn: T,
  ...rest: First
): CurryFunc<T, First> {
  return function (...args: any[]): any {
    const currentArgs = [...rest, ...args];
    return currentArgs.length >= fn.length
      ? fn(...currentArgs)
      : curry(fn, ...currentArgs);
  } as CurryFunc<T, First>;
}
