import {View} from 'react-native';
import React, {ForwardRefRenderFunction, forwardRef, memo} from 'react';
import clsx from 'clsx';

export interface IIndicatorProps {
  itemHeight: number;
  className?: string;
}

const Indicator: ForwardRefRenderFunction<View, IIndicatorProps> = (
  props,
  ref,
) => {
  const {itemHeight, className} = props;
  return (
    <View className="flex flex-1 flex-col z-10">
      <View className="flex flex-1 bg-background/70" />
      <View
        ref={ref}
        className={clsx('w-full border-t border-b border-border', className)}
        style={{
          height: itemHeight,
        }}
      />
      <View className="flex flex-1 bg-background/70" />
    </View>
  );
};

export default memo(forwardRef(Indicator));
