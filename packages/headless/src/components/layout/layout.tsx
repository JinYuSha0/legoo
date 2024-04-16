import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
} from 'react-native-keyboard-controller';
import {ScrollView, StatusBarProps, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import {cx} from 'class-variance-authority';
import {useHardwareBackPress, useStatusBar} from '@legoo/hooks';
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
  avoiding?: boolean;
  translucent?: boolean;
  paddingBottom?: boolean;
  bottomColor?: string;
  onHardwareBackPress?: () => boolean;
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

const MyKeyboardAvoidingView: React.FC<
  React.ComponentProps<typeof KeyboardAvoidingView>
> = props => {
  const {children, ...rest} = props;
  return (
    <ScrollView
      horizontal
      className="grow"
      keyboardShouldPersistTaps="handled"
      scrollEnabled={false}
      nestedScrollEnabled
      contentContainerStyle={{width: WINDOW_WIDTH}}>
      <KeyboardAvoidingView {...rest}>{children}</KeyboardAvoidingView>
    </ScrollView>
  );
};

const Layout: ForwardRefRenderFunction<any, LayoutProps> = (props, ref) => {
  const {
    children,
    avoiding,
    className,
    contentContainerClassName,
    indicatorClassName,
    translucent,
    paddingBottom = true,
    bottomColor = 'transparent',
    onHardwareBackPress,
    ...rest
  } = props;
  const {top, bottom} = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const StatusBar = useStatusBar('light-content');
  const KeyboardView = useMemo(
    () => (avoiding ? MyKeyboardAvoidingView : KeyboardAwareScrollView),
    [avoiding],
  );
  useHardwareBackPress(true, onHardwareBackPress);
  return (
    <View style={[styles.container, {paddingTop: translucent ? 0 : top}]}>
      {translucent && StatusBar}
      <KeyboardView
        ref={ref as any}
        enabled={isFocused}
        className={cx('flex-1', !avoiding ? 'mb-[-1.2px]' : '')}
        contentContainerClassName={cx('grow', contentContainerClassName)}
        indicatorClassName={cx(indicatorClassName)}
        behavior={avoiding ? 'padding' : undefined}
        keyboardShouldPersistTaps="handled"
        {...rest}>
        {children}
      </KeyboardView>
      <View
        style={{
          width: '100%',
          height: paddingBottom ? bottom : 0,
          backgroundColor: bottomColor,
        }}
      />
    </View>
  );
};

Layout.displayName = 'Layout';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default memo(forwardRef(Layout));
