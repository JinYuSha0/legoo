import { type TextInputProps, TextInput } from 'react-native';
import { cssInterop } from 'nativewind';
import React, { type ForwardRefRenderFunction, memo, forwardRef } from 'react';

export interface RestrictedTextInputProps extends TextInputProps {
  regex?: string;
}

const RestrictedTextInputImpl: ForwardRefRenderFunction<
  TextInput,
  RestrictedTextInputProps
> = (props, ref) => {
  return <TextInput ref={ref} {...props} />;
};

export const RestrictedTextInput = memo(forwardRef(RestrictedTextInputImpl));

export interface AmountInputProps extends TextInputProps {
  decimal?: number;
  separator?: string;
}

const AmountInputImpl: ForwardRefRenderFunction<TextInput, AmountInputProps> = (
  props,
  ref
) => {
  const { decimal = 0, separator = ',', ...rest } = props;
  return <TextInput ref={ref} keyboardType="numeric" {...rest} />;
};

export const AmountInput = memo(forwardRef(AmountInputImpl));

cssInterop(RestrictedTextInput, { className: 'style' });
cssInterop(AmountInput, { className: 'style' });

export default RestrictedTextInput;
