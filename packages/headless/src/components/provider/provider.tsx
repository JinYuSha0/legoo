import 'react-native-gesture-handler';

import * as React from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KeyboardProvider} from 'react-native-keyboard-controller';
import {
  SafeAreaProvider,
  initialWindowMetrics,
  type SafeAreaProviderProps,
} from 'react-native-safe-area-context';
import {ThemeProvider} from '../theme/index';
import {
  NavigationContainer,
  createNavigationContainerRef,
} from '@react-navigation/native';
import clsx from 'clsx';

export interface IAppProviderProps {
  className?: string;
  safeAreaProviderProps?: SafeAreaProviderProps;
  keyboardProviderProps?: React.ComponentProps<typeof KeyboardProvider>;
  navigationContainerProps?: React.ComponentProps<typeof NavigationContainer>;
}

// global navigation ref
export const navigationRef = createNavigationContainerRef<{[x: string]: any}>();

const AppProvider: React.FC<
  React.PropsWithChildren<IAppProviderProps>
> = props => {
  const {
    children,
    className,
    safeAreaProviderProps,
    keyboardProviderProps,
    navigationContainerProps,
  } = props;
  return (
    <SafeAreaProvider
      initialMetrics={initialWindowMetrics}
      {...safeAreaProviderProps}>
      <GestureHandlerRootView className={clsx('flex-1', className)}>
        <KeyboardProvider statusBarTranslucent {...keyboardProviderProps}>
          <NavigationContainer
            ref={navigationRef}
            {...navigationContainerProps}>
            <ThemeProvider>{children}</ThemeProvider>
          </NavigationContainer>
        </KeyboardProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

AppProvider.displayName = 'AppProvider';

export default React.memo(AppProvider);
