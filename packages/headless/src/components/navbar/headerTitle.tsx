import {statusBarHeight} from '../../helper/ui';
import {type ForwardRefRenderFunction, forwardRef, memo} from 'react';
import {View, Text} from 'react-native';
import React from 'react';
import clsx from 'clsx';

export interface IHeaderTitleProps {
  children: string;
  className?: string;
}

export const HeaderTitle: ForwardRefRenderFunction<View, IHeaderTitleProps> = (
  props,
  ref,
) => {
  const {className, children} = props;
  return (
    <View
      ref={ref}
      className="absolute top-0 left-0 bottom-0 right-0 pointer-events-none"
      style={{paddingTop: statusBarHeight}}>
      <View className="flex-1 justify-center items-center">
        <Text
          className={clsx(
            'w-7/12 text-center text-base text-foreground font-medium',
            className,
          )}
          numberOfLines={1}
          ellipsizeMode="tail">
          {children}
        </Text>
      </View>
    </View>
  );
};

HeaderTitle.displayName = 'HeaderTitle';

export default memo(forwardRef(HeaderTitle));
