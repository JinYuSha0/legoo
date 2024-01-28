import 'react-native-gesture-handler';

import * as React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from 'react-native-safe-area-context';
import clsx from 'clsx';

export interface ProviderProps {
  className?: string;
}

const Provider: React.FC<React.PropsWithChildren<ProviderProps>> = props => {
  const {children, className} = props;
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <GestureHandlerRootView className={clsx('flex-1', className)}>
        <KeyboardProvider statusBarTranslucent>{children}</KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default React.memo(Provider);
