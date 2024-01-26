import {TextInput, type TextInputProps} from 'react-native';
import React, {forwardRef, ForwardRefRenderFunction, memo} from 'react';
import clsx from 'clsx';

export interface InputProps extends TextInputProps {
  disabled?: boolean;
  className?: string;
}

const Input: ForwardRefRenderFunction<any, InputProps> = (props, ref) => {
  const {
    className,
    disabled = false,
    editable,
    selectTextOnFocus,
    ...rest
  } = props;
  return (
    <TextInput
      className={clsx(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm placeholder:text-muted-foreground outline-none focus:border-primary',
        {
          'opacity-50 cursor-not-allowed': disabled,
        },
        className,
      )}
      ref={ref}
      editable={disabled ? false : editable}
      selectTextOnFocus={disabled ? false : selectTextOnFocus}
      {...rest}
    />
  );
};

Input.displayName = 'Input';

export default memo(forwardRef(Input));
