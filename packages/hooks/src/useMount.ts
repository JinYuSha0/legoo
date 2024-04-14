import React, {useEffect, useRef} from 'react';

export function useMount() {
  const isMount = useRef<boolean>(false);

  useEffect(() => {
    isMount.current = true;
    return () => {
      isMount.current = false;
    };
  }, []);

  return isMount;
}
