import type {PressableProps} from 'react-native';
import {View, Text, Pressable} from 'react-native';
import React, {
  memo,
  forwardRef,
  ForwardRefRenderFunction,
  useMemo,
} from 'react';
import cx from 'classnames';

export enum ButtonVariants {
  Primary,
  Secondary,
  Destructive,
  Outline,
  Ghost,
}

export interface ButtonProps extends PressableProps {
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  variants?: ButtonVariants;
  children?: React.ReactNode;
}

const Button: ForwardRefRenderFunction<any, ButtonProps> = (props, ref) => {
  const {
    className,
    textClassName,
    children,
    variants = ButtonVariants.Primary,
    disabled = false,
    ...rest
  } = props;
  const computedStyle = useMemo(() => {
    const styles = {
      view: '',
      text: '',
    };
    if (disabled) {
      return styles;
    }
    switch (variants) {
      case ButtonVariants.Primary:
        styles.view = 'bg-primary active:bg-primary/90';
        styles.text = 'text-primary-foreground';
        break;
      case ButtonVariants.Secondary:
        styles.view = 'bg-secondary active:bg-secondary/90';
        styles.text = 'text-secondary-foreground';
        break;
    }
    return styles;
  }, [variants, disabled]);
  return (
    <Pressable
      ref={ref}
      disabled={disabled}
      className={cx(
        'px-4 py-2.5 rounded-md select-none',
        computedStyle.view,
        className,
      )}
      {...rest}>
      {React.isValidElement(children) ? (
        children
      ) : (
        <Text
          className={cx(
            'text-base font-semibold text-center',
            computedStyle.text,
            textClassName,
          )}>
          {children}
        </Text>
      )}
    </Pressable>
  );
};

export default memo(forwardRef(Button));
