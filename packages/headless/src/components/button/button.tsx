import type {PressableProps} from 'react-native';
import {Text, Pressable} from 'react-native';
import React, {memo, forwardRef, ForwardRefRenderFunction} from 'react';
import cx from 'classnames';

export interface ButtonProps extends PressableProps {
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  children: React.ReactNode;
}

const Button: ForwardRefRenderFunction<any, ButtonProps> = (props, ref) => {
  const {className, textClassName, children, ...rest} = props;
  return (
    <Pressable
      ref={ref}
      className={cx(
        'p-2.5 rounded-md select-none bg-primary-500 active:bg-primary-600 dark:bg-primary-700 dark:active:bg-primary-600',
        className,
      )}
      {...rest}>
      {React.isValidElement(children) ? (
        children
      ) : (
        <Text
          className={cx(
            'text-base text-center text-white dark:text-gray-100',
            textClassName,
          )}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};

export default memo(forwardRef(Button));
