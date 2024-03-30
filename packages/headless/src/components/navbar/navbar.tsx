import type {NativeStackHeaderProps} from '@react-navigation/native-stack';
import type {HeaderButtonProps} from '@react-navigation/native-stack/lib/typescript/src/types';
import React, {
  type ForwardRefRenderFunction,
  memo,
  forwardRef,
  Fragment,
  useMemo,
} from 'react';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {NavBarHeight} from '../../helper/ui';
import {cx} from 'class-variance-authority';
import DefaultHeaderLeft from './headerLeft';
import DefaultHeaderTitle from './headerTitle';

export interface INavBarProps extends NativeStackHeaderProps {
  className?: string;
  titleClassName?: string;
  leftClassName?: string;
}

const NavBar: ForwardRefRenderFunction<View, INavBarProps> = (props, ref) => {
  const {
    className,
    titleClassName,
    navigation: {canGoBack, goBack},
    options: {title, headerTintColor, headerTitle, headerLeft, headerRight},
  } = props;
  const insets = useSafeAreaInsets();
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
      if (_canGoBack) return <DefaultHeaderLeft goBack={goBack} />;
    }
    return null;
  }, [_canGoBack, _headerButtonProps, headerLeft, goBack]);
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
    <View
      ref={ref}
      className={cx('relative w-screen h-11 bg-background', className)}
      style={{height: insets.top + NavBarHeight, paddingTop: insets.top}}>
      <View className="flex flex-1 flex-row items-center justify-between">
        {_headerLeft}
        {_headerRight}
      </View>
      {_headerTitle}
    </View>
  );
};

NavBar.displayName = 'NavBar';

export default memo(forwardRef(NavBar));
