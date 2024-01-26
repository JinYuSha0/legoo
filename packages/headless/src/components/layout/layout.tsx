import {
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  SafeAreaView,
  type ScrollViewProps,
} from 'react-native';
import React, {forwardRef, ForwardRefRenderFunction, memo} from 'react';
import clsx from 'clsx';

export interface LayoutProps extends ScrollViewProps {
  className?: string;
  contentContainerClassName?: string;
  indicatorClassName?: string;
  children: React.ReactNode;
}

const Layout: ForwardRefRenderFunction<any, LayoutProps> = (props, ref) => {
  const {
    children,
    className,
    contentContainerClassName,
    indicatorClassName,
    keyboardDismissMode,
    keyboardShouldPersistTaps,
    showsHorizontalScrollIndicator,
    showsVerticalScrollIndicator,
    ...rest
  } = props;
  return <SafeAreaView>{children}</SafeAreaView>;
};

Layout.displayName = 'Layout';

export default memo(forwardRef(Layout));
