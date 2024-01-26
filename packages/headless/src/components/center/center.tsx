import {View, type ViewProps} from 'react-native';
import React, {memo, forwardRef, ForwardRefRenderFunction} from 'react';
import clsx from 'clsx';

export interface CenterProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
}

const Center: ForwardRefRenderFunction<any, CenterProps> = (props, ref) => {
  const {className, children, ...rest} = props;
  return (
    <View
      ref={ref}
      className={clsx('grow justify-center items-center', className)}
      {...rest}>
      {children}
    </View>
  );
};

export default memo(forwardRef(Center));
