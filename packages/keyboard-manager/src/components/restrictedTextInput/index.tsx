import type { TextInputProps, TextInput as RNTextInput } from 'react-native';
import React, {
  type ForwardRefRenderFunction,
  memo,
  forwardRef,
  useMemo,
} from 'react';
// @ts-ignore
import TextInput from './TextInput';

export interface RestrictedTextInputProps extends TextInputProps {
  decimal?: boolean;
  separator?: string;
  regex?: string;
}

const RestrictedTextInputImpl: ForwardRefRenderFunction<
  RNTextInput,
  RestrictedTextInputProps
> = (props, ref) => {
  return <TextInput ref={ref} {...props} />;
};

export const RestrictedTextInput = memo(forwardRef(RestrictedTextInputImpl));

export interface AmountTextInputProps extends TextInputProps {
  decimal?: boolean;
  separator?: string;
}

const AmountTextInputImpl: ForwardRefRenderFunction<
  RNTextInput,
  AmountTextInputProps
> = (props, ref) => {
  const { decimal = false, separator = ',' } = props;
  const regex = useMemo(() => {
    if (props.decimal) {
      return '[^0-9|\\.]';
    }
    return '[^(0-9)]';
  }, [props.decimal]);
  return (
    <RestrictedTextInput
      ref={ref}
      regex={regex}
      decimal={decimal}
      separator={separator}
    />
  );
};

export const AmountTextInput = memo(forwardRef(AmountTextInputImpl));

export default RestrictedTextInput;
