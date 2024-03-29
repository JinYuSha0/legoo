import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import {View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {cx} from 'class-variance-authority';
import React, {
  type ForwardRefRenderFunction,
  forwardRef,
  memo,
  useMemo,
} from 'react';

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
  const isFocused = useIsFocused();
  const KeyboardView = useMemo(
    () => (avoiding ? KeyboardAvoidingView : KeyboardAwareScrollView),
    [avoiding],
  );
  return (
    <View className={cx('flex-1', className)}>
      <KeyboardView
        ref={ref as any}
        enabled={isFocused}
        className={cx('flex-1')}
        contentContainerClassName={cx(
          'grow bg-background',
          contentContainerClassName,
        )}
        indicatorClassName={cx(indicatorClassName)}
        keyboardShouldPersistTaps="handled"
        {...rest}>
        {children}
      </KeyboardView>
    </View>
  );
};

Layout.displayName = 'Layout';

export default memo(forwardRef(Layout));
