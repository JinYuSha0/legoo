import type {NativeStackHeaderProps} from '@react-navigation/native-stack';
import type {HeaderButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import React, {
  type ForwardRefRenderFunction,
  memo,
  forwardRef,
  Fragment,
  useMemo,
} from 'react';
import {View, StatusBar} from 'react-native';
import {ChevronLeft} from 'lucide-react-native';
import {useColorScheme, cssInterop} from 'nativewind';
import DefaultHeaderLeft from './headerLeft';
import DefaultHeaderTitle from './headerTitle';
import clsx from 'clsx';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

cssInterop(ChevronLeft, {
  className: 'style',
});

export interface INavBarProps extends NativeStackHeaderProps {
  className?: string;
  titleClassName?: string;
  leftClassName?: string;
}

const NavBar: ForwardRefRenderFunction<View, INavBarProps> = (props, ref) => {
  const {
    className,
    titleClassName,
    leftClassName,
    navigation: {canGoBack, goBack},
    options: {title, headerTintColor, headerTitle, headerLeft, headerRight},
  } = props;
  const insets = useSafeAreaInsets();
  const {colorScheme} = useColorScheme();
  const _canGoBack = useMemo(() => {
    return canGoBack();
  }, []);
  const _headerButtonProps = useMemo<HeaderButtonProps>(
    () => ({
      tintColor: headerTintColor,
      canGoBack: _canGoBack,
    }),
    [_canGoBack, headerTintColor],
  );
  const _headerLeft = useMemo(() => {
    if (headerLeft) {
      return headerLeft(_headerButtonProps);
    } else {
      if (_canGoBack)
        return <DefaultHeaderLeft className={leftClassName} goBack={goBack} />;
    }
    return null;
  }, [_canGoBack, _headerButtonProps, leftClassName, headerLeft, goBack]);
  const _headerTitle = useMemo(() => {
    if (!title) return null;
    if (typeof headerTitle === 'function') {
      return headerTitle({children: title, tintColor: headerTintColor});
    }
    return (
      <DefaultHeaderTitle className={titleClassName}>
        {title}
      </DefaultHeaderTitle>
    );
  }, [title, titleClassName, headerTintColor, headerTitle]);
  const _headerRight = useMemo(
    () => headerRight && headerRight(_headerButtonProps),
    [_headerButtonProps, headerRight],
  );
  return (
    <Fragment>
      <StatusBar
        backgroundColor="transparent"
        barStyle={colorScheme !== 'light' ? 'light-content' : 'dark-content'}
      />
      <View
        ref={ref}
        className={clsx('relative w-screen h-11 bg-background', className)}
        style={{height: insets.top + 44, paddingTop: insets.top}}>
        <View className="flex flex-1 flex-row items-center justify-between">
          {_headerLeft}
          {_headerRight}
        </View>
        {_headerTitle}
      </View>
    </Fragment>
  );
};

NavBar.displayName = 'NavBar';

export default memo(forwardRef(NavBar));
