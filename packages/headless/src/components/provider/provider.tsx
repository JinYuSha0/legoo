import 'react-native-gesture-handler';

import * as React from 'react';
import {StyleSheet} from 'react-native';
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
import {ModalProvider} from './modal';

export interface IAppProviderProps {
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
    safeAreaProviderProps,
    keyboardProviderProps,
    navigationContainerProps,
  } = props;
  return (
    <SafeAreaProvider
      initialMetrics={initialWindowMetrics}
      {...safeAreaProviderProps}>
      <ModalProvider>
        <GestureHandlerRootView style={styles.container}>
          <KeyboardProvider statusBarTranslucent {...keyboardProviderProps}>
            <NavigationContainer
              ref={navigationRef}
              {...navigationContainerProps}>
              <ThemeProvider>{children}</ThemeProvider>
            </NavigationContainer>
          </KeyboardProvider>
        </GestureHandlerRootView>
      </ModalProvider>
    </SafeAreaProvider>
  );
};

AppProvider.displayName = 'AppProvider';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default React.memo(AppProvider);
