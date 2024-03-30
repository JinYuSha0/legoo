import {type DependencyList, useEffect, useRef} from 'react';

export const useNextEffect = <TCallback extends AnyFunction>(
  callback: TCallback,
  deps?: DependencyList,
) => {
  const firstFlag = useRef(true);
  useEffect(() => {
    if (firstFlag.current) {
      firstFlag.current = false;
      return;
    }
    return callback();
  }, deps);
};
