import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import {StatusBarProps, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {cx} from 'class-variance-authority';
import {useStatusBar} from '@legoo/hooks';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
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
  translucent?: boolean;
  avoiding?: boolean;
  statusBar?: StatusBarProps;
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
    translucent,
    avoiding,
    className,
    contentContainerClassName,
    indicatorClassName,
    statusBar,
    style,
    ...rest
  } = props;
  const isFocused = useIsFocused();
  const StatusBar = useStatusBar(true, statusBar);
  const {top, bottom} = useSafeAreaInsets();
  const KeyboardView = useMemo(
    () => (avoiding ? KeyboardAvoidingView : KeyboardAwareScrollView),
    [avoiding],
  );
  const containerStyle = useMemo(() => {
    if (style) return style;
    if (!translucent) {
      return {
        paddingTop: top,
        paddingBottom: bottom,
      };
    }
  }, [style, translucent, top, bottom]);
  return (
    <View className={cx('flex-1', className)} style={containerStyle}>
      {StatusBar}
      <KeyboardView
        ref={ref as any}
        enabled={isFocused}
        className={cx('flex-1', {'mb-[-2px]': !avoiding})}
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
