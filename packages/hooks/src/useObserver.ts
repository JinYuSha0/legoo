import {Observable} from '@legoo/helper';
import {useCallback, useEffect, useState} from 'react';

export const useObserver = <T extends object>(
  observable: Observable<T>,
): [T, (newValue: T | ((newValue: T) => T)) => void] => {
  const [state, _setState] = useState(observable.val);
  const onChange = useCallback((newValue: T) => {
    _setState(newValue);
  }, []);
  useEffect(() => {
    observable.on('change', onChange);
    return () => {
      observable.off('change', onChange);
    };
  }, []);
  return [state, observable.setValue];
};
