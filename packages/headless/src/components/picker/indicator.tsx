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
    <View
      ref={ref}
      className={clsx('w-full border-t border-b border-foreground', className)}
      style={{
        height: itemHeight,
      }}
    />
  );
};

export default memo(forwardRef(Indicator));
