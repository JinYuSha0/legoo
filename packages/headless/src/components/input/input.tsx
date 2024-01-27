import {TextInput, type TextInputProps} from 'react-native';
import React, {forwardRef, ForwardRefRenderFunction, memo} from 'react';
import clsx from 'clsx';

export interface InputProps extends Omit<TextInputProps, 'children'> {
  disabled?: boolean;
  className?: string;
  children?:
    | ForwardRefRenderFunction<TextInput, TextInputProps>
    | React.ReactNode;
}

const Input: ForwardRefRenderFunction<any, InputProps> = (props, ref) => {
  const {className, disabled = false, children, ...rest} = props;
  const _props: TextInputProps = {
    className: clsx(
      'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground outline-none focus:border-primary',
      {
        'opacity-50 cursor-not-allowed': disabled,
      },
      className,
    ),
    editable: disabled ? false : props.editable,
    selectTextOnFocus: disabled ? false : props.selectTextOnFocus,
    ...rest,
  };
  if (children) {
    if (typeof children === 'function') return children(_props, ref);
    return children;
  }
  return <TextInput ref={ref} {..._props} />;
};

Input.displayName = 'Input';

export default memo(forwardRef(Input));
