import {cssInterop} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller/src/components';

cssInterop(SafeAreaView, {
  className: 'style',
});
cssInterop(GestureHandlerRootView, {
  className: 'style',
});
cssInterop(KeyboardAvoidingView, {
  className: 'style',
});
cssInterop(KeyboardStickyView, {
  className: 'style',
});
cssInterop(KeyboardAwareScrollView, {
  className: 'style',
  contentContainerClassName: 'contentContainerStyle',
  indicatorClassName: 'indicatorStyle',
});

export {ThemeProvider, useThemeContext} from './components/theme';
export {
  default as AppProvider,
  type AppProviderProps,
} from './components/provider/provider';
export {default as Layout, type LayoutProps} from './components/layout/layout';
export * from './components/navbar/index';
export {default as Button, type ButtonProps} from './components/button/button';
export {default as Center, type CenterProps} from './components/center/center';
export {default as Input, type InputProps} from './components/input/input';
export {default as Card, type CardProps} from './components/card/card';
export {default as Badge, type BadgeProps} from './components/badge/badge';
export {default as Label, type LabelProps} from './components/label/label';
