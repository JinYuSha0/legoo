import {isNil, noop} from '@legoo/helper';
import {Closeable} from './types';
import React, {
  type MutableRefObject,
  createContext,
  useRef,
  useContext,
  useCallback,
} from 'react';

const PortalContext = createContext<{
  closeableRef: MutableRefObject<Closeable>;
  closeWithAnimation: (onAnimationEnd: () => void) => void;
}>({
  closeableRef: {current: null},
  closeWithAnimation: noop,
});

export const PortalProvider: React.FC<React.PropsWithChildren<{}>> = props => {
  const {children} = props;
  const closeableRef = useRef<Closeable>(null);
  const closeWithAnimation = useCallback((onAnimationEnd: () => void) => {
    if (!isNil(closeableRef.current)) {
      closeableRef.current.close(onAnimationEnd);
    } else {
      onAnimationEnd();
    }
  }, []);
  return (
    <PortalContext.Provider value={{closeableRef, closeWithAnimation}}>
      {children}
    </PortalContext.Provider>
  );
};

export const usePortalContext = () => useContext(PortalContext);
