import {cssInterop} from 'nativewind';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  KeyboardAvoidingView,
  KeyboardStickyView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller/src/components';
import {ChevronLeft} from 'lucide-react-native';

cssInterop(SafeAreaView, {
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
cssInterop(ChevronLeft, {
  className: 'style',
});

export {normalization} from './normalization';
export * from './helper/ui';
export {
  type IAppProviderProps,
  default as AppProvider,
  navigationRef,
} from './components/provider/provider';
export {default as Modal} from './components/provider/modal';
export {ThemeProvider, useThemeContext} from './components/theme';
export * from './components/portal/index';
export {type LayoutProps, default as Layout} from './components/layout/layout';
export * from './components/navbar/index';
export {type IButtonProps, default as Button} from './components/button/button';
export {type ICenterProps, default as Center} from './components/center/center';
export {type IInputProps, default as Input} from './components/input/input';
export {type ICardProps, default as Card} from './components/card/card';
export {type IBadgeProps, default as Badge} from './components/badge/badge';
export {type ILabelProps, default as Label} from './components/label/label';
export {
  type ICheckboxProps,
  default as Checkbox,
} from './components/checkbox/checkbox';
export {
  type IAlertDialogProps,
  default as AlertDialog,
} from './components/alertDialog/alertDialog';
export * from './components/picker/index';
export * from './components/datePicker/index';
export {
  type IBottomSheetProps,
  default as BottomSheet,
} from './components/bottomSheet/bottomSheet';
export {
  type ITextWithLinkProps,
  default as TextLink,
} from './components/textLink/textLink';
export * from './components/animation/index';
