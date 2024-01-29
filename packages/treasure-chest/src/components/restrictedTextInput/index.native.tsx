import type { TextInputProps, TextInput as RNTextInput } from 'react-native';
import { cssInterop } from 'nativewind';
import React, {
  type ForwardRefRenderFunction,
  memo,
  forwardRef,
  useMemo,
} from 'react';
// @ts-ignore
import TextInput from './lib/TextInput';

export interface RestrictedTextInputProps extends TextInputProps {
  regex?: string;
}

const RestrictedTextInputImpl: ForwardRefRenderFunction<
  RNTextInput,
  RestrictedTextInputProps
> = (props, ref) => {
  return <TextInput ref={ref} {...props} />;
};

export const RestrictedTextInput = memo(forwardRef(RestrictedTextInputImpl));

export interface AmountInputProps extends TextInputProps {
  decimal?: number;
  separator?: string;
}

const AmountInputImpl: ForwardRefRenderFunction<
  RNTextInput,
  AmountInputProps
> = (props, ref) => {
  const { decimal = 0, separator = ',', ...rest } = props;
  const regex = useMemo(() => {
    if (props.decimal) {
      return '[^0-9|\\.]';
    }
    return '[^(0-9)]';
  }, [props.decimal]);
  return (
    <TextInput
      ref={ref}
      regex={regex}
      decimal={decimal}
      separator={separator}
      keyboardType="numeric"
      {...rest}
    />
  );
};

export const AmountInput = memo(forwardRef(AmountInputImpl));

cssInterop(RestrictedTextInput, { className: 'style' });
cssInterop(AmountInput, { className: 'style' });

export default RestrictedTextInput;
