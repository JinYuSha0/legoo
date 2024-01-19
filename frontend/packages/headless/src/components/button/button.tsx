import type {ButtonProps} from './types';
import {Text, Pressable} from 'react-native';
import React, {memo, forwardRef, ForwardRefRenderFunction} from 'react';

// const StyledPressable = styled(
//   Pressable,
//   'p-2.5 bg-primary-500 dark:bg-primary-800 hover:bg-red-300 active:bg-red-500',
// );
// const StyledText = styled(
//   Text,
//   'text-base text-center text-white dark:text-gray-900',
// );

const Button: ForwardRefRenderFunction<any, ButtonProps> = (props, ref) => {
  const {className, textClassName, children, ...rest} = props;
  return null;
};

export default memo(forwardRef(Button));
