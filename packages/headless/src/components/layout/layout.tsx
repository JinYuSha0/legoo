import {SafeAreaView} from 'react-native-safe-area-context';
import {
  KeyboardAwareScrollView,
  KeyboardAvoidingView,
} from 'react-native-keyboard-controller';
import {ThemeProvider} from '../theme';
import React, {forwardRef, ForwardRefRenderFunction, memo} from 'react';
import clsx from 'clsx';

interface LayoutPropsBase {
  children: React.ReactNode;
  className?: string;
  contentContainerClassName?: string;
  indicatorClassName?: string;
  avoiding?: boolean;
}

interface LayoutPropsAvoiding
  extends LayoutPropsBase,
    React.ComponentProps<typeof KeyboardAvoidingView> {
  children: React.ReactNode;
  avoiding?: true;
}

interface LayoutPropsAware
  extends LayoutPropsBase,
    React.ComponentProps<typeof KeyboardAwareScrollView> {
  children: React.ReactNode;
  avoiding?: false;
}

export type LayoutProps = LayoutPropsAvoiding | LayoutPropsAware;

const Layout: ForwardRefRenderFunction<any, LayoutProps> = (props, ref) => {
  const {
    children,
    avoiding,
    className,
    contentContainerClassName,
    indicatorClassName,
    ...rest
  } = props;
  const KeyboardView = avoiding
    ? KeyboardAvoidingView
    : KeyboardAwareScrollView;
  return (
    <SafeAreaView className="flex-1">
      <KeyboardView
        ref={ref}
        className={clsx('flex-1', className)}
        contentContainerClassName={clsx('grow', contentContainerClassName)}
        indicatorClassName={clsx(indicatorClassName)}
        {...rest}>
        <ThemeProvider>{children}</ThemeProvider>
      </KeyboardView>
    </SafeAreaView>
  );
};

Layout.displayName = 'Layout';

export default memo(forwardRef(Layout));
