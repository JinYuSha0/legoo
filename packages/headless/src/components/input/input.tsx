import {
  TextInput,
  View,
  type TextInputProps,
  NativeSyntheticEvent,
  TextInputFocusEventData,
} from 'react-native';
import {VariantProps, cva, cx} from 'class-variance-authority';
import React, {
  forwardRef,
  ForwardRefRenderFunction,
  memo,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';
import {useEvent} from '@legoo/hooks';

const containerVariants = cva(
  'flex flex-1 flex-row rounded-md border border-input bg-transparent justify-between items-center',
  {
    variants: {
      variant: {
        default: '',
        focus: 'border-primary',
      },
      size: {
        default: 'h-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

const inputTextVariantes = cva(
  'flex flex-1 text-sm placeholder:text-muted-foreground',
  {
    variants: {
      variant: {
        default: '',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface ITextInput extends TextInput {
  setSecureTextEntry: (value: boolean) => void;
}

export interface IInputProps
  extends Omit<TextInputProps, 'children'>,
    VariantProps<typeof containerVariants> {
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
  children?:
    | ForwardRefRenderFunction<TextInput, TextInputProps>
    | React.ReactNode;
  suffix?: ForwardRefRenderFunction<TextInput, TextInputProps>;
  isFocused?: boolean;
}

const Input: ForwardRefRenderFunction<ITextInput, IInputProps> = (
  props,
  ref,
) => {
  const {
    className,
    inputClassName,
    disabled = false,
    children,
    suffix,
    variant,
    size,
    secureTextEntry,
    onFocus,
    onBlur,
    ...rest
  } = props;
  const inputRef = useRef<ITextInput>(null);
  const innerInputRef = useRef<ITextInput>(null);
  const _ref = (ref ?? innerInputRef) as React.MutableRefObject<
    Readonly<ITextInput>
  >;
  const [isFocused, setIsFocused] = useState(false);
  const [isSecureTextEntry, setIsSecureTextEntry] = useState(secureTextEntry);
  const _onFocus = useEvent(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onFocus?.(e);
      setIsFocused(true);
    },
  );
  const _onBlur = useEvent(
    (e: NativeSyntheticEvent<TextInputFocusEventData>) => {
      onBlur?.(e);
      setIsFocused(false);
    },
  );
  const _props: TextInputProps = useMemo(
    () => ({
      className: cx(inputTextVariantes({variant: 'default'}), inputClassName),
      editable: disabled ? false : props.editable,
      selectTextOnFocus: disabled ? false : props.selectTextOnFocus,
      isFocused,
      secureTextEntry: isSecureTextEntry,
      onFocus: _onFocus,
      onBlur: _onBlur,
      ...rest,
    }),
    [
      inputClassName,
      disabled,
      rest,
      isFocused,
      isSecureTextEntry,
      _onFocus,
      _onBlur,
    ],
  );
  const _content = useMemo(() => {
    if (typeof children === 'function') return children(_props, _ref);
    if (React.isValidElement(children)) return children;
    return null;
  }, [_props, children]);
  const _suffix = useMemo(() => {
    if (suffix) return suffix(_props, inputRef);
    return null;
  }, [_props, suffix, isFocused]);
  useImperativeHandle(inputRef, () => ({
    ..._ref.current,
    clear: () => {
      rest.onChangeText('');
      _ref.current.clear();
    },
    setSecureTextEntry: (value: boolean) => {
      setIsSecureTextEntry(value);
    },
  }));
  return (
    <View
      className={cx(
        containerVariants({variant: isFocused ? 'focus' : undefined, size}),
        {
          'opacity-50 cursor-not-allowed': disabled,
        },
        className,
      )}>
      {_content}
      {_suffix}
    </View>
  );
};

Input.displayName = 'Input';

export default memo(forwardRef(Input));
