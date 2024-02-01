import {noop} from '../common/noop';

export type Future<T> = Promise<T> & {
  resolve: (value: T | PromiseLike<T>) => void;
  reject: (reason?: any) => void;
};

export function deferred<T>() {
  let resolve: (value: T | PromiseLike<T>) => void = noop;
  let reject: (reason?: any) => void = noop;
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  const future = promise as Future<T>;
  future.resolve = resolve;
  future.reject = reject;
  return {
    future,
    promise,
    resolve,
    reject,
  };
}
