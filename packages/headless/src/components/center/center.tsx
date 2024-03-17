import {View, type ViewProps} from 'react-native';
import {cx} from 'class-variance-authority';
import React, {memo, forwardRef, ForwardRefRenderFunction} from 'react';

export interface ICenterProps extends ViewProps {
  className?: string;
  children?: React.ReactNode;
}

const Center: ForwardRefRenderFunction<any, ICenterProps> = (props, ref) => {
  const {className, children, ...rest} = props;
  return (
    <View
      ref={ref}
      className={cx('grow justify-center items-center', className)}
      {...rest}>
      {children}
    </View>
  );
};

Center.displayName = 'Center';

export default memo(forwardRef(Center));
