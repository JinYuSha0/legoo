import {
  KeyboardAwareScrollView,
  KeyboardAvoidingView,
} from 'react-native-keyboard-controller';
import {View} from 'react-native';
import React, {
  type ForwardRefRenderFunction,
  forwardRef,
  memo,
  useMemo,
} from 'react';
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
  const KeyboardView = useMemo(
    () => (avoiding ? KeyboardAvoidingView : KeyboardAwareScrollView),
    [avoiding],
  );
  return (
    <View className={clsx('flex-1', className)}>
      <KeyboardView
        ref={ref}
        className={clsx('flex-1')}
        contentContainerClassName={clsx(
          'grow bg-background',
          contentContainerClassName,
        )}
        indicatorClassName={clsx(indicatorClassName)}
        keyboardShouldPersistTaps="handled"
        {...rest}>
        {children}
      </KeyboardView>
    </View>
  );
};

Layout.displayName = 'Layout';

export default memo(forwardRef(Layout));
